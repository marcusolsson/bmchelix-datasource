import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { config } from '@grafana/runtime';
import cloneDeep from 'lodash/cloneDeep';
import groupBy from 'lodash/groupBy';
import { QueryHandlerFactory } from 'QueryHandlerFactory';
import { ADEAuthHelper } from './auth/ADEAuthHelper';
import { EntAuthHelper } from './auth/EntAuthHelper';
import { BMCDataSourceOptions, BMCDataSourceQuery, InstancePlatform, validQueryType } from './types';

export interface BatchedQueries {
  instance: any;
  optionsVal: DataQueryRequest<BMCDataSourceQuery>;
}

export class BMCDataSource extends DataSourceApi<BMCDataSourceQuery, BMCDataSourceOptions> {
  queryHandler: any;
  instSet: DataSourceInstanceSettings<BMCDataSourceOptions>;
  instPlatform: InstancePlatform;
  static tokenObj: any = { adeJWTToken: '', expiry: null };
  private static authHelper: ADEAuthHelper | EntAuthHelper;
  private readonly INVALID_QUERY_TYPE =
    'Please provide query type value in query json. Query must be start with query type followed by comma. Please refer to documentation for more details.';
  private readonly INVALID_QUERY = 'Please provide a valid query. Please refer to documentation for more details.';
  private readonly EMPTY_QUERY = 'Please provide a non-empty query.';
  private readonly CONST_SOURCE_TYPE = 'sourceType';
  private readonly CONST_FAIL = 'fail';
  private readonly CONST_SUCCESS = 'success';
  private readonly TEST_DS_SUCCESS_MSG = 'Success';

  constructor(
    instanceSettings: DataSourceInstanceSettings<BMCDataSourceOptions>,
    private templateSrv: any,
    private timeSrv: any,
    private backendSrv: any
  ) {
    super(instanceSettings);
    this.instSet = instanceSettings;
    this.queryHandler = {};

    this.instPlatform = config.bootData.settings.EnvType ? InstancePlatform.ADE : InstancePlatform.ENTERPRISE;
    this.initAuthHelper();
  }

  initAuthHelper() {
    if (!BMCDataSource.authHelper) {
      switch (this.instPlatform) {
        case InstancePlatform.ADE: {
          BMCDataSource.authHelper = new ADEAuthHelper();
          BMCDataSource.tokenObj = BMCDataSource.authHelper.initToken(this.backendSrv);
          break;
        }
        case InstancePlatform.ENTERPRISE: {
          BMCDataSource.authHelper = new EntAuthHelper();
          BMCDataSource.authHelper.initToken(this.instSet);
          break;
        }
      }
    }
  }

  async validateToken() {
    if (this.instPlatform === InstancePlatform.ENTERPRISE) {
      const token = await BMCDataSource.authHelper.getToken(this.instSet);
      BMCDataSource.tokenObj = token;
    }
  }

  async query(options: DataQueryRequest<BMCDataSourceQuery>): Promise<DataQueryResponse> {
    await this.validateToken();

    const targetsMapping: { [sourceType: string]: BMCDataSourceQuery[] } = groupBy(
      options.targets,
      this.CONST_SOURCE_TYPE
    );

    const mixed: BatchedQueries[] = [];
    for (const sourceType in targetsMapping) {
      if (sourceType === undefined || !validQueryType(sourceType)) {
        return Promise.resolve({ data: [] });
      }

      const query_options = cloneDeep(options);
      query_options.targets = targetsMapping[sourceType];

      const type: BatchedQueries = {
        instance: this.getQueryHandlerInstance(sourceType),
        optionsVal: query_options,
      };

      mixed.push(type);
    }

    return this.batchQueries(mixed);
  }

  batchQueries(queries: BatchedQueries[]): DataQueryResponse | PromiseLike<DataQueryResponse> {
    let results: any[] = [];
    const queryPromises = queries.map(async query => {
      const queryResponse = await query.instance.query(query.optionsVal);
      queryResponse.data.forEach((item: any) => {
        results.push(item);
      });

      return queryResponse;
    });
    return Promise.all(queryPromises).then((responses: any) => {
      return Promise.resolve({ data: results });
    });
  }

  getQueryHandlerInstance(queryType: string): any {
    this.queryHandler[queryType] = QueryHandlerFactory.getDatasource(
      queryType,
      this.instSet,
      this.templateSrv,
      this.timeSrv,
      this.backendSrv
    );
    return this.queryHandler[queryType];
  }

  async metricFindQuery(query: any) {
    var index = query.indexOf(',');
    if (index === -1) {
      return Promise.reject({ status: this.CONST_FAIL, message: this.INVALID_QUERY });
    }

    var queryArr = [query.slice(0, index), query.slice(index + 1)];
    const queryType: string = queryArr[0].trim().toLowerCase();
    const queryString: string = queryArr[1];

    if (!validQueryType(queryType)) {
      return Promise.reject({ status: this.CONST_FAIL, message: this.INVALID_QUERY_TYPE });
    } else if (queryString === '') {
      return Promise.reject({ status: this.CONST_FAIL, message: this.EMPTY_QUERY });
    }

    await this.validateToken();

    const queryHandlerInstance = this.getQueryHandlerInstance(queryType);
    return queryHandlerInstance.metricFindQuery(queryString);
  }

  async annotationQuery(options: any): Promise<any> {
    if (options.annotation.selectedType) {
      await this.validateToken();
      const queryHandlerInstance = this.getQueryHandlerInstance(options.annotation.selectedType);
      return queryHandlerInstance.annotationQuery(options);
    } else {
      console.log('options.annotation: ' + options.annotation);
      throw new Error('selectedType not present.');
    }
  }

  async testDatasource() {
    /*TODO*/

    // Implement a health check for your data source.
    return {
      status: this.CONST_SUCCESS,
      message: this.TEST_DS_SUCCESS_MSG,
    };
  }
}

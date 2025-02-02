import coreModule from 'grafana/app/core/core_module';
import _ from 'lodash';
import * as queryDef from './remedy_query_def';
import { SourceList, SelectionList, RemedyForm } from './RemedyTypes';
import { TEMPLATE_BASE_URL } from 'Constants';
import {
  EMPTY,
  COLUMN_TYPE_FIELD,
  COLUMN_TYPE_SELECT_FORM_NAME,
  COLUMN_TYPE_SELECT_COLUMN_NAME,
  COLUMN_TYPE_SELECT_COLUMN_TYPE,
  ARROW,
} from './remedy_literal_string';
export class RemedyGroupQueryCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: any) {
    const IDENTIFIER_PREFIX = 'G';
    const inputForm: RemedyForm = $scope.target.form;
    const inputSourceList: SourceList[] = $scope.target.form.sourceList;
    const inputSelectionList: SelectionList[] = $scope.target.form.selectionList;
    const inputGroupList: SelectionList[] = $scope.target.form.groupByField;

    $scope.init = () => {
      $scope.remedyForm = inputGroupList;
      $scope.remedyForm.hideGroupBy = inputForm.hideGroupBy;

      $scope.inputValue = {
        // selectionSeqGroupBy: 0,
        selectionType: inputGroupList[$scope.index].selectionType || COLUMN_TYPE_SELECT_COLUMN_TYPE,
        selectionColumnName: inputGroupList[$scope.index].selectionColumnName || COLUMN_TYPE_SELECT_COLUMN_NAME,
        selectionAlias: inputGroupList[$scope.index].selectionAlias || IDENTIFIER_PREFIX + ($scope.index + 1),
        selectionSrcAlias: inputGroupList[$scope.index].selectionSrcAlias || COLUMN_TYPE_SELECT_FORM_NAME,
      };

      $scope.inputAutoComplete = {
        selectionType: queryDef.getColumnTypes(),
        selectionColumnName: inputForm.meta.metaGroupNames || COLUMN_TYPE_SELECT_COLUMN_NAME,
        selectionAlias: queryDef.getColumnAliases(),
        selectionSrcAlias: inputForm.meta.metaFullFormNames || COLUMN_TYPE_SELECT_FORM_NAME,
      };
      $scope.inputAutoComplete.selectionAlias.splice(0, 0, {
        text: IDENTIFIER_PREFIX + ($scope.index + 1),
        value: IDENTIFIER_PREFIX + ($scope.index + 1),
      });

      // $scope.isFirstOnClause = true;
      $scope.validateModel();
    };

    $rootScope.onAppEvent(
      'remedy-column-query-updated',
      () => {
        $scope.updateColumnsForGroup();
      },
      $scope
    );

    $rootScope.onAppEvent(
      'remedy-query-updated',
      () => {
        $scope.validateModel();
      },
      $scope
    );

    $scope.validateModel = () => {
      $scope.isFirst = $scope.index === 0;
      $scope.isSingle = $scope.remedyForm.length === 1;
    };

    $scope.updateColumnsForGroup = () => {
      inputForm.meta.metaGroupNames = [];
      _.each(inputSelectionList, column => {
        if (!queryDef.isDBFunctionsAggregate(column.selectionType)) {
          let form: SourceList = inputSourceList[0];
          _.find(inputSourceList, function(f) {
            if (column.selectionColumnName.includes(f.sourceFormName)) {
              form = f;
            }
          });
          inputForm.meta.metaGroupNames = inputForm.meta.metaGroupNames.concat({
            text: column.selectionType + ARROW + column.selectionColumnName,
            value: {
              formName: form.sourceFormName,
              formAlias: form.sourceAlias,
              columnName: column.selectionType + ARROW + column.selectionColumnName,
            },
          });
        }
      });
      $scope.inputAutoComplete.selectionColumnName = inputForm.meta.metaGroupNames;
    };

    $scope.addColumnTypeMenu = function(menu: { text: any; value: any }, subMenu: { text: any; value: any }) {
      if (inputForm.hideGroupBy) {
        return;
      }
      let menuValue = menu.value;
      if (subMenu && subMenu.value) {
        menuValue = subMenu.value;
      }
      $scope.inputValue.selectionType = menuValue;
      $scope.onColumnTypeChange();
    };

    $scope.onColumnTypeChange = () => {
      inputGroupList[$scope.index].selectionType = $scope.inputValue.selectionType;
      $scope.showClause = true;
      // $scope.isFirstOnClause = true;

      $scope.onChange();
    };

    $scope.onColumnNameChange = () => {
      // Remove previously added alias
      if ($scope.inputAutoComplete.selectionAlias.length === 3) {
        $scope.inputAutoComplete.selectionAlias.splice(0, 1);
      }
      // Add new alias
      $scope.inputAutoComplete.selectionAlias.splice(0, 0, {
        text: $scope.inputValue.selectionColumnName.columnName,
        value: $scope.inputValue.selectionColumnName.columnName,
      });

      // Assign column as Form Name and Column Value
      inputGroupList[$scope.index].selectionColumnName = $scope.inputValue.selectionColumnName.columnName;
      inputGroupList[$scope.index].selectionAlias = $scope.inputValue.selectionAlias;

      // Assign Source Alias
      _.some(inputForm.meta.metaFullFormNames, srcAlias => {
        if (inputGroupList[$scope.index].selectionColumnName.includes(srcAlias.text)) {
          // Assign Selection Type
          $scope.inputValue.selectionType = inputGroupList[$scope.index].selectionColumnName.substring(
            0,
            inputGroupList[$scope.index].selectionColumnName.indexOf(ARROW)
          );
          inputGroupList[$scope.index].selectionType = $scope.inputValue.selectionType;

          // Assign Source Alias
          if (inputForm.useAlias) {
            $scope.inputValue.selectionSrcAlias = $scope.inputValue.selectionColumnName.formAlias;
            inputGroupList[$scope.index].selectionSrcAlias = $scope.inputValue.selectionSrcAlias;
          } else {
            $scope.inputValue.selectionSrcAlias = srcAlias.value;
            inputGroupList[$scope.index].selectionSrcAlias = $scope.inputValue.selectionSrcAlias;
          }
          return;
        }
      });

      // refresh group names across all scopes
      $rootScope.appEvent('remedy-group-query-updated');

      $scope.onChange();
    };

    $scope.onColumnAliasChange = () => {
      inputGroupList[$scope.index].selectionColumnName = $scope.inputValue.selectionColumnName;
      inputGroupList[$scope.index].selectionAlias = $scope.inputValue.selectionAlias;

      $scope.onChange();
    };

    $scope.addRemedyColumn = () => {
      if (inputForm.hideGroupBy) {
        return;
      }
      const addIndex = inputGroupList.length;
      $scope.inputValue.selectionSeqGroupBy += 1;
      let defaultGroupByField: SelectionList = new SelectionList(
        COLUMN_TYPE_FIELD,
        COLUMN_TYPE_SELECT_COLUMN_NAME,
        EMPTY,
        EMPTY
      );
      inputGroupList.splice(addIndex, 0, defaultGroupByField);

      $scope.onChange();
    };

    $scope.removeRemedyColumn = () => {
      if (inputForm.hideGroupBy) {
        return;
      }
      if ($scope.index === 0) {
        inputGroupList.splice(inputGroupList.length - 1, 1);
      } else {
        inputGroupList.splice($scope.index, 1);
      }
      $scope.inputValue.selectionSeqGroupBy -= 1;

      $scope.onChange();
    };

    $scope.toggleShowGroupByQuery = () => {
      $scope.remedyForm.hideGroupBy = !$scope.remedyForm.hideGroupBy;
      inputForm.hideGroupBy = $scope.remedyForm.hideGroupBy;
      if (!$scope.remedyForm.hideGroupBy) {
        delete $scope.remedyForm.hideGroupBy;
      }

      // refresh column names across all scopes
      $rootScope.appEvent('remedy-group-query-updated');
      $scope.onChange();
    };

    $scope.init();
    $scope.updateColumnsForGroup();
  }
}

export function remedyGroupQuery() {
  return {
    templateUrl: TEMPLATE_BASE_URL + '/partials/remedy/remedy.group.query.html',
    controller: RemedyGroupQueryCtrl,
    controllerAs: 'remedygroupctrl',
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      datasource: '=',
      onChange: '&',
    },
  };
}

coreModule.directive('remedyGroupQuery', remedyGroupQuery);

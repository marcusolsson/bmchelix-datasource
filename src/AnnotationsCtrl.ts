import { queryTypeOptions } from 'types';
import * as Constants from 'Constants';

export class BMCAnnotationsQueryCtrl {
  static templateUrl = Constants.ANNOTATION_EDITOR_BASE_URL;
  constants = Constants;

  queryTypes: any;
  annotation: any;

  /** @ngInject */
  constructor() {
    this.queryTypes = queryTypeOptions;
    if (!this.annotation.selectedType) {
      this.annotation.selectedType = this.constants.SOURCE_TYPE_EVENT;
    }
  }

  onqueryTypeSelection() {
    console.log('Selected Query type in Annotation: ' + this.annotation.selectedType);
  }
}

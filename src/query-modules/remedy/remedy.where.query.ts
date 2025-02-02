import coreModule from 'grafana/app/core/core_module';
import _ from 'lodash';
import { TEMPLATE_BASE_URL } from 'Constants';
import { RemedyForm, Qualification } from './RemedyTypes';

export class RemedyWhereQueryCtrl {
  /** @ngInject */
  constructor($scope: any, uiSegmentSrv: any, $rootScope: any) {
    const inputForm: RemedyForm = $scope.target.form;
    const inputQualification: Qualification = $scope.target.form.qualification;

    $scope.init = () => {
      $scope.qualType = 'Where';
      $scope.remedyForm = inputQualification;
      $scope.remedyForm.hideQual = inputForm.hideQual;

      $scope.inputValue = inputQualification;

      $scope.inputAutoComplete = {};

      $scope.showGroup = false;
      // $scope.isFirstOnClause = true;
      $scope.validateModel();
    };

    $rootScope.onAppEvent(
      'remedy-qual-query-updated',
      () => {
        $scope.validateModel();
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
    };

    $scope.init();
  }
}

export function remedyWhereQuery() {
  return {
    templateUrl: TEMPLATE_BASE_URL + '/partials/remedy/remedy.where.query.html',
    controller: RemedyWhereQueryCtrl,
    controllerAs: 'remedywherectrl',
    restrict: 'E',
    scope: {
      target: '=',
      index: '=',
      datasource: '=',
      onChange: '&',
    },
  };
}

coreModule.directive('remedyWhereQuery', remedyWhereQuery);

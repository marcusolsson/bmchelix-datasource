import { BMCDataSourceQuery } from '../../types';
import { SINGLE_IDENTIFIER } from './remedy_literal_string';

export interface RemedyDataSourceQuery extends BMCDataSourceQuery {
  sourceQuery: RemedyQuery;
}

export class RemedyQuery {
  version: string;
  queryType: string;
  formatAs: string;
  rawQuery: string;
  form: RemedyForm;
  type?: string;
  query?: string;
  constructor($version: string, $queryType: string, $formatAs: string, $rawQuery: string, $form: RemedyForm) {
    this.version = $version;
    this.queryType = $queryType;
    this.formatAs = $formatAs;
    this.rawQuery = $rawQuery;
    this.form = $form;
  }
}

export class RemedyForm {
  meta: RemedyMetaForm;
  sourceList: SourceList[];
  selectionList: SelectionList[];
  hideQual: boolean;
  useOneEqualOne?: boolean = false;
  qualification: Qualification[];
  hideGroupBy: boolean;
  groupByField: SelectionList[];
  hideHaving: boolean;
  havingQualification: Qualification[];
  hideSort: boolean;
  sortField: SortField[];
  useDistinct: boolean;
  useAlias: boolean;
  startEntry: number;
  maxEntries: number;
  useLocale: boolean;
  outputNumMatches: boolean;

  constructor(
    $meta: RemedyMetaForm,
    $sourceList: SourceList[],
    $selectionList: SelectionList[],
    $hideQual: boolean,
    $qualification: Qualification[],
    $hideGroupBy: boolean,
    $groupByField: SelectionList[],
    $hideHaving: boolean,
    $havingQualification: Qualification[],
    $hideSort: boolean,
    $sortField: SortField[],
    $useDistinct: boolean,
    $useAlias: boolean,
    $startEntry: number,
    $maxEntries: number,
    $useLocale: boolean,
    $outputNumMatches: boolean
  ) {
    this.meta = $meta;
    this.sourceList = $sourceList;
    this.selectionList = $selectionList;
    this.hideQual = $hideQual;
    this.qualification = $qualification;
    this.hideGroupBy = $hideGroupBy;
    this.groupByField = $groupByField;
    this.hideHaving = $hideHaving;
    this.havingQualification = $havingQualification;
    this.hideSort = $hideSort;
    this.sortField = $sortField;
    this.useDistinct = $useDistinct;
    this.useAlias = $useAlias;
    this.startEntry = $startEntry;
    this.maxEntries = $maxEntries;
    this.useLocale = $useLocale;
    this.outputNumMatches = $outputNumMatches;
  }
}

export class SelectionList {
  selectionType: string;
  selectionColumnName: string;
  selectionSrcAlias: string;
  selectionAlias: string;
  constructor(
    $selectionType: string,
    $selectionColumnName: string,
    $selectionSrcAlias: string,
    $selectionAlias: string
  ) {
    this.selectionType = $selectionType;
    this.selectionColumnName = $selectionColumnName;
    this.selectionSrcAlias = $selectionSrcAlias;
    this.selectionAlias = $selectionAlias;
  }
}

export class Qualification {
  collapseGroup?: boolean = true;
  splitGroup?: boolean = false;
  showGroup: boolean;
  groupCounter: number;
  groupHierarchy: string;
  qualificationType: string;
  logicalOperator: string;
  relationalOperator: string;
  leftQualification: Qualification | null;
  rightQualification: Qualification | null;
  leftOperand: LeftOperand | null;
  rightOperand: RightOperand | null;
  constructor(
    $showGroup: boolean,
    $groupCounter: number,
    $groupHierarchy: string,
    $qualificationType: string,
    $logicalOperator: string,
    $relationalOperator: string,
    $leftQualification: Qualification | null,
    $rightQualification: Qualification | null,
    $leftOperand: LeftOperand | null,
    $rightOperand: RightOperand | null
  ) {
    this.showGroup = $showGroup;
    this.groupCounter = $groupCounter;
    this.groupHierarchy = $groupHierarchy;
    this.qualificationType = $qualificationType;
    this.logicalOperator = $logicalOperator;
    this.relationalOperator = $relationalOperator;
    this.leftQualification = $leftQualification;
    this.rightQualification = $rightQualification;
    this.leftOperand = $leftOperand;
    this.rightOperand = $rightOperand;
  }
}

export class LeftOperand {
  fieldType: string;
  fieldAlias: string | null;
  fieldName: string;
  fieldSourceAlias: string;
  constructor($fieldType: string, $fieldAlias: string | null, $fieldName: string, $fieldSourceAlias: string) {
    this.fieldType = $fieldType;
    this.fieldAlias = $fieldAlias;
    this.fieldName = $fieldName;
    this.fieldSourceAlias = $fieldSourceAlias;
  }
}

export class RightOperand {
  fieldType: string;
  fieldAlias: string | null;
  fieldDataType: string;
  fieldValue: string;
  fieldName: string;
  fieldSourceAlias: string;
  constructor(
    $fieldType: string,
    $fieldAlias: string | null,
    $fieldDataType: string,
    $fieldValue: string,
    $fieldName: string,
    $fieldSourceAlias: string
  ) {
    this.fieldType = $fieldType;
    this.fieldAlias = $fieldAlias;
    this.fieldDataType = $fieldDataType;
    this.fieldValue = $fieldValue;
    this.fieldName = $fieldName;
    this.fieldSourceAlias = $fieldSourceAlias;
  }
}

export class RemedyMetaForm {
  syncToSql: boolean;
  hideSql: boolean;
  rawSql: string;
  hideJson: boolean;
  rawJson: string;
  metaFullFormNames: any[];
  metaColumnNames: any[];
  metaGroupNames: any[];

  constructor(
    $syncToSql: boolean,
    $hideSql: boolean,
    $rawSql: string,
    $hideJson: boolean,
    $rawJson: string,
    $metaFullFormNames: any[],
    $metaColumnNames: any[],
    $metaGroupNames: any[]
  ) {
    this.syncToSql = $syncToSql;
    this.hideSql = $hideSql;
    this.rawSql = $rawSql;
    this.hideJson = $hideJson;
    this.rawJson = $rawJson;
    this.metaFullFormNames = $metaFullFormNames;
    this.metaColumnNames = $metaColumnNames;
    this.metaGroupNames = $metaGroupNames;
  }
}

export class SortField {
  sortOperand: SelectionList;
  sortOrder: string;
  constructor($sortOperand: SelectionList, $sortOrder: string) {
    this.sortOperand = $sortOperand;
    this.sortOrder = $sortOrder;
  }
}

export class SourceList {
  sourceType: string;
  sourceFormName: string;
  sourceAlias: string;
  sourceHideClause: boolean;
  sourceJoinClause: Qualification[];
  onClause?: RemedyFormOnClause[];
  constructor(
    $sourceType: string,
    $sourceFormName: string,
    $sourceAlias: string,
    $sourceHideClause: boolean,
    $sourceJoinClause: Qualification[]
  ) {
    this.sourceType = $sourceType;
    this.sourceFormName = $sourceFormName;
    this.sourceAlias = $sourceAlias;
    this.sourceHideClause = $sourceHideClause;
    this.sourceJoinClause = $sourceJoinClause;
  }
}

export class RemedyFormOnClause {
  qualificationGroupType: string;
  qualificationGroupAndOr: string;
  qualificationGroupLeftOperand: string;
  qualificationGroupOperator: string;
  qualificationGroupRightOperand: string;
  constructor(
    $qualificationGroupType: string,
    $qualificationGroupAndOr: string,
    $qualificationGroupLeftOperand: string,
    $qualificationGroupOperator: string,
    $qualificationGroupRightOperand: string
  ) {
    this.qualificationGroupType = $qualificationGroupType;
    this.qualificationGroupAndOr = $qualificationGroupAndOr;
    this.qualificationGroupLeftOperand = $qualificationGroupLeftOperand;
    this.qualificationGroupOperator = $qualificationGroupOperator;
    this.qualificationGroupRightOperand = $qualificationGroupRightOperand;
  }
}

export class GroupQualification {
  qualType: string;
  qualification: Qualification | null;
  groupQualification: GroupQualification[] | null;

  constructor(
    $qualType: string,
    $qualification: Qualification | null,
    $groupQualification: GroupQualification[] | null
  ) {
    this.qualType = $qualType;
    this.qualification = $qualification;
    this.groupQualification = $groupQualification;
  }
  addGroupQualification(groupQualification: GroupQualification) {
    this.groupQualification?.push(groupQualification);
  }

  isSingle() {
    return this.qualType === SINGLE_IDENTIFIER;
  }
}

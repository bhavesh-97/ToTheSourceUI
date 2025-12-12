export class MCommonEntitiesMaster {
  public IsActive: boolean = false;
  public CreatedBy?: number = 0;
  public CreatedDate?: Date = new Date();
  public UpdatedBy?: number = 0;
  public UpdatedDate?: Date = new Date();
  public IsDeleted?: boolean = false;
  public DeletedBy?: number = 0;
  public DeletedDate?: Date = new Date();
}
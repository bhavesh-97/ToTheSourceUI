
export class MUserMenuIDAM {
    roleID!: string;
    roleName!: string;
    menuID!: number;
    title!: string;
    isParentMenu!: boolean;
    parentMenuID!: number;
    permissions!: MPageRights;
    link!: string;
    children!: any[];
    //icon:string="grid-outline";
    // icon?: string | NbIconConfig;
    icon!: any;
}
export class MPageRights {
    canInsert: boolean = false;
    canUpdate: boolean = false;
    canDelete: boolean = false;
    canView: boolean = false;
}

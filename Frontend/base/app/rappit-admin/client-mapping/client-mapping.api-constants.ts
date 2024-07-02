

export class ClientMappingApiConstants {
    public static readonly getDatatableData: any = {
        url: '/rest/rappitexposedapiclients/sql/datatable',
        method: 'POST',
        showloading: true
    };
    public static readonly setup: any = {
        url: '/rest/rappitexposedapiclients/sql/setup',
        method: 'POST',
        showloading: true
    };
    public static readonly getById: any = {
        url: '/rest/rappitexposedapiclients/sql/{sid}',
        method: 'GET',
        showloading: true
    };
    public static readonly update: any = {
        url: '/rest/rappitexposedapiclients/sql',
        method: 'PUT',
        showloading: true
    };
}
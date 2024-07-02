export interface ClientMappingBase {
	producer: string;
	consumer: string;
	mail:string;
	userContextRequired:boolean;
	clientName: string;
	clientID: string;
	sid: string;
	authenticationMode: string;
	role: string;
}
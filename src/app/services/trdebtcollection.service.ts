import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
    providedIn: 'root'
})
export class TrdebtcollectionService {

    constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

    public createOrUpdate(data: any) {
        return this.httpClient.post<any>(this.configService.getAPI('trdebtcollection/save'), data).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public importFromExcel(data: any) {
        return this.httpClient.post<any>(this.configService.getAPI('trdebtcollection/importFromExcel'), data).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }
    

    public findAll() {
        return this.httpClient.get<any>(this.configService.getAPI('trdebtcollection/findAll')).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByPk(value: string) {
        return this.httpClient.get<any>(this.configService.getAPI('trdebtcollection/findByPk?value=' + value)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByStatus(statusCode: string = '', username: string = '', startDate: string = '', endDate: string = '', searchTxt: string = '') {
        let param = "?statusCode=" + statusCode + "&username=" + username + "&startDate=" + startDate + "&endDate=" + endDate + "&searchTxt=" + searchTxt;
        return this.httpClient.get<any>(this.configService.getAPI('trdebtcollection/findByStatus' + param)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findAllTrace() {
        return this.httpClient.get<any>(this.configService.getAPI('trdebtcollection/findAllTrace')).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findMyTrace(status: string) {
        return this.httpClient.get<any>(this.configService.getAPI('trdebtcollection/findMyTrace?status=' + status)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }


}
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
    providedIn: 'root'
})
export class MscustomerService {

    constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

    public createOrUpdate(data: any) {
        return this.httpClient.post<any>(this.configService.getAPI('mscustomer/save'), data).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findAll() {
        return this.httpClient.get<any>(this.configService.getAPI('mscustomer/findAll')).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByPk(value: string) {
        return this.httpClient.get<any>(this.configService.getAPI('mscustomer/findByPk?value=' + value)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByDebt(debtId: string) {
        return this.httpClient.get<any>(this.configService.getAPI('mscustomer/findByDebt?debtId=' + debtId)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByName(searchTxt: string) {
        return this.httpClient.get<any>(this.configService.getAPI('mscustomer/findByName?searchTxt=' + searchTxt)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }


}
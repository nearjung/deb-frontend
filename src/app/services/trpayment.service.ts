import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigServerService } from '../core/config-server.service';

@Injectable({
    providedIn: 'root'
})
export class TrpaymentService {

    constructor(private httpClient: HttpClient, private configService: ConfigServerService) { }

    public createOrUpdate(data: any) {
        return this.httpClient.post<any>(this.configService.getAPI('trpayment/save'), data).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findAll() {
        return this.httpClient.get<any>(this.configService.getAPI('trpayment/findAll')).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByPk(value: string) {
        return this.httpClient.get<any>(this.configService.getAPI('trpayment/findByPk?value=' + value)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }

    public findByDebt(debtId: string) {
        return this.httpClient.get<any>(this.configService.getAPI('trpayment/findByDebt?debtId=' + debtId)).pipe(
            map(respons => {
                return {
                    serviceResult: respons
                }
            }));
    }
}
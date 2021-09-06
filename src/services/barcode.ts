import dayjs, { Dayjs } from 'dayjs';
import { Service } from 'typedi';

interface BarcodeRequestOption {
  /** 요청 시작 위치 */
  startIndex?: number;
  /** 요청 종료 위치 */
  endIndex?: number;
  /** 변경일자 기준 이후 자료 출력 */
  changeDate?: Dayjs | Date;
  /** 품목 제조 보고 번호 */
  productRepotNumber?: number;
  /** 바코드 번호 */
  barcode?: number;
}

interface Result {
  /** 품목보고(신고)번호 */
  PRDLST_REPORT_NO: string;
  /** 보고(신고일) */
  PRMS_DT: string;
  /** 생산중단일. 생산중이면 빈 문자열 */
  END_DT: string;
  /** 제품명 */
  PRDLST_NM: string;
  /** 유통기한. 몇개월, 어디에 보관 */
  POG_DAYCNT: string;
  /** 식품 유형 */
  PRDLST_DCNM: string;
  /** 제조사명 */
  BSSH_NM: string;
  /** 업종 */
  INDUTY_NM: string;
  /** 주소 */
  SITE_ADDR: string;
  /** 폐업일자. 폐업이 아니면 빈 문자열 */
  CLSBIZ_DT: string;
  /** 유통 바코드 */
  BAR_CD: string;
}

export interface BarcodeResult {
  /** 품목보고(신고)번호 */
  productReportNumber: string;
  /** 보고(신고일) */
  productReportDate: string;
  /** 생산중단일. 생산중이면 빈 문자열 */
  endDate: string;
  /** 제품명 */
  productName: string;
  /** 유통기한. 몇개월, 어디에 보관 */
  shelfLife: string;
  /** 식품 유형 */
  productType: string;
  /** 제조사명 */
  manufacturerName: string;
  /** 업종 */
  industryName: string;
  /** 주소 */
  siteAddress: string;
  /** 폐업일자. 폐업이 아니면 빈 문자열 */
  closeBusinessDate: string;
  /** 유통 바코드 */
  barcode: string;
}

@Service()
export default class BarcodeService {
  private formatDate(date: Dayjs | Date) {
    return (date instanceof Date ? dayjs(date) : date).format('YYYYMMDD');
  }

  private fetchData({
    startIndex = 1,
    endIndex = 1,
    barcode,
    changeDate,
    productRepotNumber,
  }: BarcodeRequestOption) {
    const searchParams = new URLSearchParams();
    changeDate && searchParams.append('CHNG_DT', this.formatDate(changeDate));
    productRepotNumber &&
      searchParams.append('PRDLST_REPORT_NO', productRepotNumber.toString());
    barcode && searchParams.append('BAR_CD', barcode.toString());
    return fetch(
      `http://openapi.foodsafetykorea.go.kr/api/keyId/serviceId/dataType/${startIndex}/${endIndex}?${searchParams.toString()}`,
    ).then((res) => res.json() as Promise<Result[]>);
  }

  public async getBarcodeInfo(code: number): Promise<BarcodeResult[]> {
    const response = await this.fetchData({ barcode: code });
    return response.map(
      ({
        BAR_CD,
        CLSBIZ_DT,
        END_DT,
        INDUTY_NM,
        BSSH_NM,
        PRDLST_NM,
        PRMS_DT,
        PRDLST_REPORT_NO,
        PRDLST_DCNM,
        POG_DAYCNT,
        SITE_ADDR,
      }) => ({
        barcode: BAR_CD,
        closeBusinessDate: CLSBIZ_DT,
        endDate: END_DT,
        industryName: INDUTY_NM,
        manufacturerName: BSSH_NM,
        productName: PRDLST_NM,
        productReportDate: PRMS_DT,
        productReportNumber: PRDLST_REPORT_NO,
        productType: PRDLST_DCNM,
        shelfLife: POG_DAYCNT,
        siteAddress: SITE_ADDR,
      }),
    );
  }
}

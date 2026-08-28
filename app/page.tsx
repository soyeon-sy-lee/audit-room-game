"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Question = { stage: string; kicker: string; prompt: string; choices: string[]; answer: number; explanation: string; basis: string; skill: "판단력" | "의구심" | "효율성" };
type AuditCase = {
  id: string; number: string; company: string; code: string; year: string; field: string; category: string; basis: string; summary: string; risk: string; accent: string;
  metrics: [string, string][]; terms: { term: string; meaning: string; why: string }[]; questions: Question[]; reportDate: string; report: [string, string][]; note: string;
  sources: { label: string; detail: string; url: string }[];
};

const cases: AuditCase[] = [
  {
    id: "samsung-sds-2023", number: "01", company: "삼성SDS", code: "018260", year: "2023", field: "IT 서비스 · 물류", category: "TECHNOLOGY", basis: "연결 재무제표",
    summary: "장기 SI 프로젝트의 원가 추정과 진행률을 끝까지 추적하세요.", risk: "ESTIMATION RISK", accent: "#d7ff37",
    metrics: [["매출", "13.28조"], ["영업이익", "8,082억"], ["총자산", "12.32조"], ["전년 매출", "17.23조"]],
    terms: [
      { term: "SI 프로젝트", meaning: "System Integration의 약자. 고객 업무에 맞춰 여러 정보시스템을 설계·개발·연결하는 장기 프로젝트입니다.", why: "완성까지 여러 달 또는 여러 해가 걸려, 실제로 얼마나 수행했는지에 따라 매출을 나눠 인식하는 경우가 많습니다." },
      { term: "진행률", meaning: "전체 계약 업무 중 결산일까지 수행한 비율입니다. 흔히 실제 투입원가 ÷ 총예정원가로 계산합니다.", why: "총예정원가를 낮게 잡으면 진행률과 당기 매출·이익이 과대계상될 수 있어 감사위험이 큽니다." },
      { term: "계약자산", meaning: "일은 수행했지만 청구조건이 아직 충족되지 않아 고객에게 바로 받을 수 없는 대가입니다.", why: "진행률 추정이 낙관적이면 계약자산도 함께 부풀려질 수 있습니다." },
    ],
    questions: [
      { stage: "계획 단계", kicker: "FIRST MOVE", prompt: "SI 프로젝트 매출의 진행률을 검토하려 합니다. 가장 먼저 요청할 자료 묶음은?", choices: ["법인카드 명세와 임직원 경비 정산서", "프로젝트별 계약서, 총예정원가 산출 근거, 실제 원가 투입 내역", "유형자산 취득명세와 감가상각 스케줄"], answer: 1, explanation: "진행률은 누적발생원가와 총예정원가에 직접 좌우됩니다. 계약 조건, 총예정원가의 승인·변경 근거, 실제 투입원가를 연결해야 위험에 대응할 수 있습니다.", basis: "감사기준서 315 · 330 · 500", skill: "효율성" },
      { stage: "위험 평가", kicker: "FOLLOW THE RISK", prompt: "당기 프로젝트의 총예정원가가 반복해서 하향 조정되었습니다. 우선 집중할 재무제표 계정은?", choices: ["계약자산·매출·매출원가와 손실충당부채", "현금및현금성자산과 단기금융상품", "자본금과 주식발행초과금", "퇴직급여채무와 기타포괄손익"], answer: 0, explanation: "총예정원가 하향은 진행률과 당기 매출·이익을 높일 수 있습니다. 계약자산, 누적 매출·원가, 손실 프로젝트 충당 여부를 프로젝트 단위로 연결해 봐야 합니다.", basis: "감사기준서 240 · 315 · K-IFRS 1115", skill: "의구심" },
      { stage: "통제 테스트", kicker: "TEST THE CONTROL", prompt: "진행률 산정 프로세스에서 가장 설득력 있는 핵심통제 조합은?", choices: ["매월 매출 합계가 전월보다 증가하는지 확인", "프로젝트 매니저가 본인 산출물을 스스로 승인", "총예정원가 변경의 독립적 승인과 원가 데이터 인터페이스 완전성 검증"], answer: 2, explanation: "추정 변경은 독립적인 검토·승인이 필요하고, 진행률 계산에 들어가는 원가 데이터의 완전성과 정확성도 함께 통제되어야 합니다.", basis: "감사기준서 315 · 330 · 540", skill: "판단력" },
      { stage: "핵심감사사항", kicker: "WHAT MATTERED MOST", prompt: "2023년 연결감사에서 핵심감사사항으로 가장 타당한 항목은?", choices: ["SI 서비스 진행률 계산의 적정성", "사무실 비품의 내용연수", "보통주 주당 액면가 표시", "현금배당 지급일의 주석 문구"], answer: 0, explanation: "실제 보고서는 미래 노무비·외주비 추정과 프로젝트 변경에 경영진 판단이 크게 개입하는 SI 서비스 진행률 산정을 핵심감사사항으로 정했습니다.", basis: "감사기준서 701", skill: "판단력" },
      { stage: "보고 단계", kicker: "SIGN YOUR OPINION", prompt: "충분하고 적합한 증거를 확보했고 중요왜곡표시가 발견되지 않았습니다. 최종 보고 조합은?", choices: ["적정의견 · 계속기업 중요 불확실성 없음 · 연결 내부회계 적정", "한정의견 · 계속기업 중요 불확실성 있음 · 내부회계 의견거절", "부적정의견 · 강조사항으로 SI 매출 표시", "의견거절 · 핵심감사사항은 기재하지 않음"], answer: 0, explanation: "실제 결론은 연결재무제표 및 연결 내부회계관리제도 적정의견이며, 계속기업 관련 중요한 불확실성은 보고되지 않았습니다.", basis: "감사기준서 570 · 700 · 외감법", skill: "판단력" },
    ],
    reportDate: "2024.03.05", report: [["감사의견", "적정의견"], ["핵심감사사항", "SI 서비스 진행률 계산의 적정성"], ["계속기업 중요 불확실성", "해당 없음"], ["연결 내부회계관리제도", "적정의견"], ["기타사항", "전기 재무제표는 타 감사인 감사"]],
    note: "핵심감사사항은 별도 의견이 아니라, 당기 감사에서 가장 유의적이었던 사항을 설명합니다.",
    sources: [
      { label: "2023 연결감사보고서", detail: "삼성SDS 공식 IR", url: "https://image.samsungsds.com/en/investor/financial_info/report/__icsFiles/afieldfile/2024/05/16/Samsung%20SDS_FY23_Audit%20report_signed.pdf" },
      { label: "2023 사업보고서", detail: "DART 연계 공시", url: "https://kind.krx.co.kr/external/2024/03/12/001390/20240312003502/11011.htm" },
      { label: "외부감사인 선임 공고", detail: "삼일회계법인 · 2023–2025", url: "https://www.samsungsds.com/kr/investor/board/1276104_4302.html" },
    ],
  },
  {
    id: "nexon-games-2023", number: "02", company: "넥슨게임즈", code: "225570", year: "2023", field: "게임 개발 · 서비스", category: "MEDIA", basis: "연결 재무제표",
    summary: "게임 현금창출단위의 영업권 321억원, 낙관적 전망을 의심하세요.", risk: "IMPAIRMENT RISK", accent: "#ff7657",
    metrics: [["총자산", "3,669억"], ["영업권", "321억"], ["게임 CGU 영업권", "256억"], ["종업원", "1,275명"]],
    terms: [
      { term: "영업권", meaning: "회사를 인수할 때 식별 가능한 순자산의 공정가치보다 더 지급한 금액입니다.", why: "매년 가치가 유지되는지 손상검사를 해야 하며, 미래 실적 전망에 경영진 판단이 많이 들어갑니다." },
      { term: "CGU(현금창출단위)", meaning: "다른 자산과 비교적 독립적으로 현금을 벌어들이는 가장 작은 자산 묶음입니다.", why: "영업권 자체는 현금을 만들지 못하므로 관련 CGU에 배부해 손상 여부를 검사합니다." },
      { term: "사용가치", meaning: "자산이나 CGU가 앞으로 벌 것으로 예상되는 현금을 현재가치로 환산한 금액입니다.", why: "성장률·이익률·할인율이 조금만 달라져도 평가액이 크게 바뀔 수 있습니다." },
    ],
    questions: [
      { stage: "계획 단계", kicker: "MAP THE CGU", prompt: "영업권 손상검사 감사에서 가장 먼저 받아야 할 자료는?", choices: ["현금창출단위별 장부금액 배부표와 이사회 승인 사업계획", "전체 임직원 급여대장", "법인인감 사용대장"], answer: 0, explanation: "영업권이 어느 현금창출단위에 배부되었는지 확정한 뒤, 장부금액과 회수가능액을 같은 단위로 비교해야 합니다.", basis: "감사기준서 315 · 500 · K-IFRS 1036", skill: "효율성" },
      { stage: "추정 검토", kicker: "CHALLENGE THE MODEL", prompt: "사용가치 모형에서 감사인이 가장 강하게 반증해야 할 가정 조합은?", choices: ["매출 성장률·영업이익률·할인율·영구성장률", "자본금·주당 액면가·발행주식수", "법인 주소·전화번호·홈페이지", "급여 지급일·복리후생비 계정명"], answer: 0, explanation: "회수가능액은 작은 가정 변화에도 크게 움직일 수 있습니다. 외부 시장자료, 과거 예측 정확도와 민감도 분석으로 경영진 가정을 반증합니다.", basis: "감사기준서 540", skill: "의구심" },
      { stage: "감사 절차", kicker: "LOOK BACK", prompt: "경영진 예측의 편향을 평가하는 가장 직접적인 절차는?", choices: ["전년도 예측과 실제 실적을 비교하고 차이 원인을 검토", "당기 재무제표 합계만 재계산", "대표이사 확인서만 수령"], answer: 0, explanation: "과거 예측 대비 실적의 지속적인 미달은 현재 예측에 낙관 편향이 있을 수 있다는 강한 감사증거입니다.", basis: "감사기준서 240 · 540", skill: "의구심" },
      { stage: "핵심감사사항", kicker: "WHAT MATTERED MOST", prompt: "실제 2023년 연결감사보고서의 핵심감사사항은?", choices: ["영업권이 배부된 현금창출단위에 대한 손상평가", "현금 시재의 실재성", "임차보증금 분류", "자본금 표시"], answer: 0, explanation: "영업권 규모가 유의적이고 사용가치에 경영진의 중요한 판단이 포함되어 손상평가가 핵심감사사항으로 선정됐습니다.", basis: "감사기준서 701", skill: "판단력" },
      { stage: "보고 단계", kicker: "SIGN YOUR OPINION", prompt: "감사결과 중요왜곡표시가 없고 손상검사 공시도 충분합니다. 실제 보고 결론은?", choices: ["적정의견 · 계속기업 중요 불확실성 없음", "한정의견 · 영업권 전액 손상", "의견거절 · 범위 제한", "부적정의견 · 계속기업 청산기준"], answer: 0, explanation: "실제 연결감사보고서는 적정의견이며 계속기업 관련 중요한 불확실성은 기재되지 않았습니다.", basis: "감사기준서 570 · 700", skill: "판단력" },
    ],
    reportDate: "2024.03.20", report: [["감사의견", "적정의견"], ["핵심감사사항", "영업권이 배부된 CGU 손상평가"], ["중점 대상", "게임 부문 영업권 256억원"], ["계속기업 중요 불확실성", "해당 없음"], ["감사인", "삼일회계법인"]],
    note: "손상차손이 없더라도 추정 불확실성과 금액의 유의성 때문에 핵심감사사항이 될 수 있습니다.",
    sources: [{ label: "2023 연결감사보고서", detail: "DART 재구성 원문", url: "https://financialfilings.com/filings/nexon-games-co-ltd/audit-report-information/2024/8170348/" }, { label: "2023 감사보고서 안내", detail: "넥슨게임즈 공식 IR", url: "https://www.nexongames.co.kr/bbs/board.php?bo_table=etc_notice&page=1&wr_id=43" }],
  },
  {
    id: "hybe-2023", number: "03", company: "하이브", code: "352820", year: "2023", field: "음악 · 플랫폼 · 공연", category: "MEDIA", basis: "별도 재무제표",
    summary: "멀티레이블 구조에서 종속기업투자의 손상 징후를 찾아내세요.", risk: "VALUATION RISK", accent: "#b7a7ff",
    metrics: [["자산", "3.69조"], ["매출", "1.37조"], ["당기순이익", "614억원"], ["종업원", "771명"]],
    terms: [
      { term: "종속기업투자", meaning: "지배회사가 지배력을 가진 자회사에 투자한 금액을 별도재무제표에 표시한 계정입니다.", why: "자회사의 사업가치가 떨어지면 투자 장부금액을 회수하지 못할 수 있어 손상검토가 필요합니다." },
      { term: "손상징후", meaning: "반복 손실, 예산 미달, 시장가치 하락처럼 자산 가치가 떨어졌을 가능성을 보여주는 신호입니다.", why: "징후가 있으면 장부금액과 회수가능액을 비교하는 본격적인 손상검사를 수행합니다." },
      { term: "멀티레이블", meaning: "여러 음악 레이블이 각자 아티스트와 콘텐츠를 운영하는 사업 구조입니다.", why: "레이블별 성과와 전망이 달라 법인별 사업계획과 투자 가치를 따로 검토해야 합니다." },
    ],
    questions: [
      { stage: "계획 단계", kicker: "UNDERSTAND THE GROUP", prompt: "종속기업투자 손상 위험을 파악하기 위한 첫 자료 묶음은?", choices: ["법인별 실적·사업계획, 투자 장부금액, 손상징후 검토표", "본사 소모품 구매명세", "주주명부와 배당금 지급내역"], answer: 0, explanation: "별도재무제표의 종속기업투자는 법인별 장부금액과 회수가능액을 비교해야 하므로 그룹 구조와 각 법인의 실적을 먼저 연결해야 합니다.", basis: "감사기준서 315 · 500", skill: "효율성" },
      { stage: "위험 평가", kicker: "FIND THE TRIGGER", prompt: "손상 징후로 가장 강한 조합은?", choices: ["피투자회사의 반복 손실·예산 미달·시장가치 하락", "본사 직원 수 증가·사무실 이전", "주가 상승·현금배당 실시", "감가상각비의 정기 인식"], answer: 0, explanation: "반복 손실과 계획 미달, 외부가치 하락은 회수가능액이 장부금액보다 낮을 수 있음을 나타내는 대표적 손상 징후입니다.", basis: "K-IFRS 1036 · 감사기준서 540", skill: "의구심" },
      { stage: "감사 절차", kicker: "TRACE THE FORECAST", prompt: "멀티레이블 사업계획의 신뢰성을 가장 잘 검증하는 절차는?", choices: ["아티스트·콘텐츠별 과거 예측 정확도와 확정된 컴백·공연 계약을 대조", "경영진의 구두 설명만 기록", "전체 매출 합계만 전기와 비교"], answer: 0, explanation: "콘텐츠 일정과 계약은 미래 현금흐름의 구체적 근거입니다. 과거 예측 오차까지 함께 보면 경영진 편향을 평가할 수 있습니다.", basis: "감사기준서 500 · 540", skill: "의구심" },
      { stage: "핵심감사사항", kicker: "WHAT MATTERED MOST", prompt: "2023년 별도재무제표 감사의 핵심감사사항은?", choices: ["종속기업투자에 대한 손상평가", "공연장 임차료 지급", "보통주 액면가", "퇴직급여 지급 시기"], answer: 0, explanation: "실제 사업보고서에는 별도재무제표의 종속기업투자 손상평가가 핵심감사사항으로 기재됐습니다.", basis: "감사기준서 701", skill: "판단력" },
      { stage: "보고 단계", kicker: "SIGN YOUR OPINION", prompt: "손상평가 증거가 충분하고 중요한 왜곡이 없습니다. 실제 2023년 보고 결과는?", choices: ["적정의견 · 강조사항 없음 · 계속기업 중요 불확실성 없음", "한정의견 · 계속기업 중요 불확실성", "부적정의견 · 모든 종속기업투자 제거", "의견거절 · 감사증거 전무"], answer: 0, explanation: "하이브의 2023년 연결 및 별도 재무제표에는 삼일회계법인이 적정의견을 표명했고 강조사항은 보고되지 않았습니다.", basis: "감사기준서 570 · 700", skill: "판단력" },
    ],
    reportDate: "2024.03.15", report: [["감사의견", "적정의견"], ["핵심감사사항(별도)", "종속기업투자에 대한 손상평가"], ["강조사항", "해당 없음"], ["계속기업 중요 불확실성", "해당 없음"], ["감사인", "삼일회계법인"]],
    note: "연결과 별도재무제표는 감사 초점이 다를 수 있습니다. 이 사건은 지배회사의 별도 종속기업투자 계정에 집중합니다.",
    sources: [{ label: "2023 사업보고서", detail: "English DART", url: "https://englishdart.fss.or.kr/dsbh002/viewer.do?rcpNo=20240322000254" }, { label: "2023 감사보고서", detail: "DART 재구성 원문", url: "https://financialfilings.com/filings/hybe-co-ltd/audit-report-information/2024/8158700/" }],
  },
  {
    id: "kakao-2023", number: "04", company: "카카오", code: "035720", year: "2023", field: "플랫폼 · 콘텐츠 · 금융", category: "TECHNOLOGY", basis: "연결·별도 재무제표",
    summary: "에스엠 인수의 식별가능자산과 영업권, 손상평가를 연결하세요.", risk: "ACQUISITION RISK", accent: "#ffe13b",
    metrics: [["총자산", "25.18조"], ["현금성자산", "5.27조"], ["무형자산", "5.69조"], ["회계연도", "제29기"]],
    terms: [
      { term: "사업결합", meaning: "한 회사가 다른 사업의 지배력을 취득하는 거래입니다. 일반적인 주식투자보다 복잡한 취득 회계가 적용됩니다.", why: "취득일, 지급대가, 인수한 자산·부채의 공정가치를 모두 판단해야 합니다." },
      { term: "PPA(인수가격배분)", meaning: "인수대금을 취득한 식별가능 자산·부채와 영업권에 나누어 배분하는 가치평가 절차입니다.", why: "배분 결과에 따라 이후 감가상각·상각과 손상검사, 당기손익이 달라집니다." },
      { term: "식별가능 무형자산", meaning: "브랜드, 고객관계, 계약권리처럼 물리적 형태는 없지만 따로 구분해 가치를 측정할 수 있는 자산입니다.", why: "가치와 내용연수에 복잡한 추정이 필요해 전문가의 검토가 자주 사용됩니다." },
    ],
    questions: [
      { stage: "계획 단계", kicker: "READ THE DEAL", prompt: "에스엠 사업결합 회계처리를 감사할 때 가장 먼저 요청할 자료는?", choices: ["주식매매계약, 취득일 판단 문서, 인수가격배분(PPA) 보고서", "전사 법인카드 사용내역", "본사 건물 감가상각표"], answer: 0, explanation: "취득일·이전대가·식별가능자산과 부채의 공정가치가 사업결합 회계처리의 출발점입니다.", basis: "K-IFRS 1103 · 감사기준서 500", skill: "효율성" },
      { stage: "가치평가", kicker: "CHALLENGE FAIR VALUE", prompt: "PPA에서 전문가 투입을 우선 고려할 영역은?", choices: ["아티스트 관련 무형자산·고객관계의 공정가치와 내용연수", "보통예금 잔액", "자본금 액면가", "단기 미지급 급여"], answer: 0, explanation: "콘텐츠 기업의 식별가능 무형자산은 복잡한 가치평가 모형과 가정을 사용하므로 감사인의 가치평가 전문가 활용을 고려할 수 있습니다.", basis: "감사기준서 540 · 620", skill: "판단력" },
      { stage: "후속 검토", kicker: "FOLLOW THE GOODWILL", prompt: "사업결합 후 영업권 손상평가에서 가장 중요한 연결은?", choices: ["PPA 결과 → CGU 배부 → 사업계획 → 회수가능액", "주주명부 → 배당일 → 지급은행", "법인인감 → 계약번호 → 우편번호"], answer: 0, explanation: "취득에서 인식된 영업권이 적절한 현금창출단위에 배부되고, 그 단위의 회수가능액에 포함됐는지 연속적으로 추적해야 합니다.", basis: "K-IFRS 1036 · 감사기준서 540", skill: "의구심" },
      { stage: "핵심감사사항", kicker: "WHAT MATTERED MOST", prompt: "실제 2023년 연결감사에서 보고된 핵심감사사항은?", choices: ["에스엠엔터테인먼트 사업결합 회계처리", "현금배당의 지급 시점", "사무실 비품 실재성", "자본금 표시"], answer: 0, explanation: "카카오의 2023년 연결재무제표에서는 에스엠엔터테인먼트 사업결합 회계처리가 핵심감사사항으로 다뤄졌습니다.", basis: "감사기준서 701", skill: "판단력" },
      { stage: "보고 단계", kicker: "SIGN YOUR OPINION", prompt: "PPA와 손상검토에 충분한 증거를 확보했습니다. 실제 결론과 맞는 조합은?", choices: ["적정의견 · 연결 KAM은 에스엠 사업결합 · 별도 KAM은 관련 투자 손상평가", "한정의견 · 사업결합 회계처리 전면 부인", "의견거절 · 에스엠 연결 제외", "부적정의견 · 계속기업 청산기준"], answer: 0, explanation: "실제 보고에서 연결 핵심감사사항은 에스엠 사업결합, 별도 핵심감사사항에는 에스엠 및 카카오엔터테인먼트 투자 손상평가가 포함됐습니다.", basis: "감사기준서 701 · 700", skill: "판단력" },
    ],
    reportDate: "2024.03", report: [["감사의견", "적정의견"], ["핵심감사사항(연결)", "에스엠엔터테인먼트 사업결합"], ["핵심감사사항(별도)", "종속기업투자주식 손상평가"], ["계속기업 중요 불확실성", "해당 없음"], ["감사인", "삼일회계법인"]],
    note: "동일 거래라도 연결에서는 사업결합 회계처리, 별도에서는 종속기업투자주식 손상평가가 핵심이 될 수 있습니다.",
    sources: [{ label: "2023 기업지배구조보고서", detail: "카카오 공식 IR", url: "https://t1.kakaocdn.net/kakaocorp/admin/ir/best-practice/5688.pdf" }, { label: "회계감사인 의견 공시", detail: "카카오 공식 IR", url: "https://t1.kakaocdn.net/kakaocorp/admin/ir/business-report/5655.pdf" }],
  },
  {
    id: "lg-electronics-2023", number: "05", company: "LG전자", code: "066570", year: "2023", field: "전자 · 플랫폼 · 전장", category: "TECHNOLOGY", basis: "연결 재무제표",
    summary: "147개 종속회사와 84조원 매출, 그룹감사의 범위를 설계하세요.", risk: "GROUP AUDIT RISK", accent: "#79d9ff",
    metrics: [["매출", "84.23조"], ["영업이익", "3.55조"], ["총자산", "60.24조"], ["종속회사", "147개"]],
    terms: [
      { term: "그룹감사", meaning: "지배회사와 여러 종속회사를 합친 연결재무제표에 대해 수행하는 감사입니다.", why: "그룹감사인은 해외·국내 구성요소 감사인의 업무까지 지시하고 검토해 전체 의견을 책임집니다." },
      { term: "구성요소", meaning: "그룹 안에서 별도의 재무정보를 작성하는 회사, 사업부 또는 지역 단위입니다.", why: "규모가 크거나 특정 위험이 높은 구성요소를 골라 충분한 감사범위를 확보해야 합니다." },
      { term: "연결조정", meaning: "그룹 내부거래와 채권·채무, 미실현손익 등을 제거해 그룹을 하나의 회사처럼 표시하는 조정입니다.", why: "종속회사가 많을수록 제거 누락이나 환산 오류가 연결재무제표 전체를 왜곡할 수 있습니다." },
    ],
    questions: [
      { stage: "그룹 계획", kicker: "SCOPING FIRST", prompt: "147개 종속회사가 있는 그룹감사의 첫 핵심 판단은?", choices: ["구성요소별 재무적 유의성·특정위험을 평가해 감사범위를 정한다", "모든 법인에 동일한 한 페이지 질문서를 보낸다", "지배회사 숫자만 감사한다"], answer: 0, explanation: "그룹 구조, 구성요소의 규모와 특정위험을 바탕으로 전체 재무제표에 충분한 범위를 확보해야 합니다.", basis: "감사기준서 600", skill: "효율성" },
      { stage: "위험 평가", kicker: "FOLLOW THE BUSINESS", prompt: "가전·TV·전장 사업에서 서로 다른 위험을 가장 잘 반영한 감사계획은?", choices: ["사업본부별 매출조건, 재고 노후화, 품질보증충당부채를 따로 평가", "모든 사업본부에 현금만 집중", "연결조정은 감사하지 않음"], answer: 0, explanation: "제품과 계약조건이 다른 사업은 수익인식, 재고평가, 보증의무 위험도 다르므로 사업본부별 대응이 필요합니다.", basis: "감사기준서 315 · 330", skill: "판단력" },
      { stage: "구성요소 감사", kicker: "DIRECT THE TEAM", prompt: "해외 구성요소 감사인에게 반드시 전달할 내용으로 가장 적절한 것은?", choices: ["그룹 중요성, 유의적 위험, 수행절차와 보고기한", "본사 회식 일정", "전년도 보고서 표지만"], answer: 0, explanation: "그룹감사인은 구성요소 감사인의 업무를 지시·감독·검토하고 그룹의 유의적 위험이 일관되게 다뤄지도록 해야 합니다.", basis: "감사기준서 600", skill: "효율성" },
      { stage: "감사 절차", kicker: "CHECK CONSOLIDATION", prompt: "연결조정에서 우선 검사할 항목은?", choices: ["내부거래·채권채무 제거, 미실현손익, 환산조정", "지배회사 우편요금", "임원 명함 제작비", "보통주 액면가만"], answer: 0, explanation: "대규모 그룹에서는 내부거래 제거와 환산, 연결범위 누락이 전체 재무제표 왜곡으로 이어질 수 있습니다.", basis: "감사기준서 600 · 500", skill: "의구심" },
      { stage: "보고 단계", kicker: "SIGN YOUR OPINION", prompt: "그룹 전반에서 충분한 증거를 확보했고 중요한 왜곡이 없습니다. 실제 2023년 결론은?", choices: ["적정의견 · 계속기업 중요 불확실성 없음 · 내부회계 비적정 없음", "한정의견 · 구성요소 범위 제한", "의견거절 · 147개 회사 감사 불가", "부적정의견 · 연결 제외"], answer: 0, explanation: "실제 공시상 연결 및 별도 재무제표는 적정의견이고, 계속기업 중요 불확실성과 내부회계 비적정 사항은 보고되지 않았습니다.", basis: "감사기준서 570 · 700 · 외감법", skill: "판단력" },
    ],
    reportDate: "2024.03.14", report: [["감사의견", "적정의견"], ["연결대상 종속회사", "147개"], ["계속기업 중요 불확실성", "해당 없음"], ["내부회계 비적정 여부", "해당 없음"], ["감사인", "삼일회계법인"]],
    note: "그룹의 크기만으로 의견변형을 하는 것은 아닙니다. 범위를 적절히 설계하고 충분한 증거를 확보했는지가 핵심입니다.",
    sources: [{ label: "2023 감사보고서 제출", detail: "DART 재구성 원문", url: "https://financialfilings.com/filings/lg-electronics-inc/audit-report-information/2024/8181403/" }, { label: "2023 기업지배구조보고서", detail: "LG전자 공식 IR", url: "https://www.lg.com/content/dam/lge/global/ir/02-company-information/LGE%202023%20Corporate%20Governace%20Report.pdf" }],
  },
];

const ranks = [
  { min: 0, title: "New Staff", year: "1년차" }, { min: 200, title: "Associate", year: "2년차" }, { min: 500, title: "Senior Associate", year: "3년차" },
  { min: 900, title: "Senior", year: "4년차" }, { min: 1500, title: "Manager", year: "6년차" }, { min: 2400, title: "Senior Manager", year: "8년차+" },
];

function rankFor(xp: number) { return [...ranks].reverse().find((rank) => xp >= rank.min) ?? ranks[0]; }

export default function Home() {
  const [screen, setScreen] = useState<"desk" | "case" | "result">("desk");
  const [caseId, setCaseId] = useState(cases[0].id);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [xp, setXp] = useState(120);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [earnedXp, setEarnedXp] = useState(0);

  useEffect(() => {
    const savedXp = window.localStorage.getItem("audit-room-xp");
    const savedCases = window.localStorage.getItem("audit-room-completed");
    if (savedXp) setXp(Number(savedXp));
    if (savedCases) setCompletedIds(JSON.parse(savedCases));
    if (!window.localStorage.getItem("audit-room-notice-seen")) setNoticeOpen(true);
  }, []);

  const activeCase = cases.find((item) => item.id === caseId) ?? cases[0];
  const question = activeCase.questions[current];
  const points = 100 / activeCase.questions.length;
  const rank = rankFor(xp);
  const nextRank = ranks.find((item) => item.min > xp);
  const nextProgress = nextRank ? Math.min(100, ((xp - rank.min) / (nextRank.min - rank.min)) * 100) : 100;
  const stats = useMemo(() => {
    const answered = submitted ? current + 1 : current;
    return { 판단력: 62 + answered * 4, 의구심: 58 + answered * 5, 효율성: 60 + Math.round((score / 100) * 20) };
  }, [current, score, submitted]);

  function resetProgress() { setCurrent(0); setSelected(null); setSubmitted(false); setScore(0); setEarnedXp(0); }
  function closeNotice() { window.localStorage.setItem("audit-room-notice-seen", "true"); setNoticeOpen(false); }
  function openDesk() { resetProgress(); setScreen("desk"); }
  function startCase(id: string) { setCaseId(id); resetProgress(); setScreen("case"); window.scrollTo({ top: 0, behavior: "smooth" }); }
  function advance() {
    if (!submitted) { if (selected === null) return; setSubmitted(true); if (selected === question.answer) setScore((value) => value + points); return; }
    if (current < activeCase.questions.length - 1) { setCurrent((value) => value + 1); setSelected(null); setSubmitted(false); return; }
    const gain = 40 + Math.round(score);
    const newXp = xp + gain;
    const newCompleted = [...new Set([...completedIds, activeCase.id])];
    setEarnedXp(gain); setXp(newXp); setCompletedIds(newCompleted);
    window.localStorage.setItem("audit-room-xp", String(newXp));
    window.localStorage.setItem("audit-room-completed", JSON.stringify(newCompleted));
    setScreen("result");
  }
  function choiceState(index: number) { if (!submitted) return selected === index ? "selected" : ""; if (index === question.answer) return "correct"; if (selected === index) return "wrong"; return "muted"; }
  const roundedScore = Math.round(score);
  const choiceOffset = (Number(activeCase.number) + current) % question.choices.length;
  const displayedChoices = question.choices.map((choice, originalIndex) => ({ choice, originalIndex })).slice(choiceOffset).concat(question.choices.map((choice, originalIndex) => ({ choice, originalIndex })).slice(0, choiceOffset));

  return (
    <main className="game-shell" style={{ "--case-accent": activeCase.accent } as CSSProperties}>
      <header className="topbar">
        <button className="brand" onClick={openDesk} aria-label="케이스 데스크로"><span>／A</span> AUDIT ROOM</button>
        <nav aria-label="주요 메뉴"><button className="nav-active" onClick={openDesk}>Case desk</button><button onClick={() => document.querySelector(".career-strip")?.scrollIntoView({ behavior: "smooth" })}>Career</button><button onClick={() => setSourcesOpen(true)}>Source notes</button><button onClick={() => setNoticeOpen(true)}>이용안내</button></nav>
        <div className="profile"><div><small>{rank.title.toUpperCase()} · {rank.year}</small><strong>{xp.toLocaleString()} XP</strong></div><div className="avatar">A</div></div>
      </header>
      <div className="notice-strip"><b>실제 공시 사실</b><span>＋</span><b>교육용 가상 감사상황</b><p>문제의 상황·선택지는 학습을 위해 재구성되었으며 해당 기업에서 실제 발생한 사실을 뜻하지 않습니다.</p><button onClick={() => setNoticeOpen(true)}>전체 안내 보기</button></div>

      {screen === "desk" ? (
        <>
          <section className="desk-head"><div><p className="eyebrow">TMT AUDIT · CASE DESK</p><h1>다음 감사는<br /><em>어느 회사입니까?</em></h1><p className="lead">2023년 이후 삼일회계법인 감사 고객의 공개 공시를 바탕으로 만든 5개 교육용 사건입니다. 실제 수치·보고 결과와 가상 감사상황을 구분해 제공합니다.</p></div><div className="desk-count"><strong>{cases.length}</strong><span>PLAYABLE<br />ENGAGEMENTS</span></div></section>
          <section className="case-grid">{cases.map((item) => (
            <button className="case-tile" key={item.id} onClick={() => startCase(item.id)} style={{ "--tile-accent": item.accent } as CSSProperties}>
              <div className="tile-top"><span>CASE {item.number}</span><i>{completedIds.includes(item.id) ? "완료 ✓" : "OPEN →"}</i></div>
              <div className="tile-company"><small>{item.code} · FY{item.year}</small><h2>{item.company}</h2><p>{item.field}</p></div>
              <p className="tile-summary">{item.summary}</p><div className="tile-bottom"><span>{item.risk}</span><b>{item.questions.length} DECISIONS</b></div>
            </button>
          ))}</section>
          <section className="desk-method"><p className="section-label">HOW IT WORKS</p><div><span>01</span><b>공시 단서 읽기</b><p>사업 구조와 숫자에서 위험 신호를 찾습니다.</p></div><div><span>02</span><b>감사 절차 선택</b><p>2–5개의 객관식 선택지 중 판단을 확정합니다.</p></div><div><span>03</span><b>실제 보고서 대조</b><p>의견·KAM·계속기업 결론을 실제 공시와 비교합니다.</p></div></section>
        </>
      ) : (
        <>
          <section className="case-head"><div><button className="back-link" onClick={openDesk}>← CASE DESK</button><p className="eyebrow">LIVE ENGAGEMENT · CASE {activeCase.number}</p><h1>숫자를 믿지 말고,<br /><em>증거를 믿으세요.</em></h1><p className="lead">{activeCase.company}의 {activeCase.year}년 감사. {activeCase.summary}</p></div><div className="case-stamp" aria-label={`${activeCase.year} 회계연도 ${activeCase.category} 사건`}><span>FY</span><strong>{activeCase.year}</strong><small>TMT · {activeCase.category}</small></div></section>
          {screen === "case" ? (
            <section className="workspace" aria-live="polite">
              <aside className="case-file"><p className="section-label">CLIENT BRIEF</p><div className="client-title"><span>{activeCase.code}</span><h2>{activeCase.company}</h2></div><p>{activeCase.field}<br />{activeCase.basis}</p><dl>{activeCase.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="risk-chip">{activeCase.risk} <b>HIGH</b></div><p className="data-note">단위 반올림 · {activeCase.year} 기준</p></aside>
              <article className="question-card">
                <details className="term-brief" defaultOpen key={activeCase.id}>
                  <summary><span>먼저 읽는 산업·감사용어</span><b>{activeCase.terms.length}개 용어 <i>＋</i></b></summary>
                  <div className="term-grid">{activeCase.terms.map((item) => <div key={item.term}><strong>{item.term}</strong><p>{item.meaning}</p><small><b>왜 중요할까?</b> {item.why}</small></div>)}</div>
                </details>
                <div className="scenario-disclosure"><b>교육용 가상 감사상황</b><span>아래 상황과 선택지는 감사 훈련을 위해 재구성했습니다. 해당 기업에서 실제로 발생한 사실이나 부정행위를 의미하지 않습니다.</span></div>
                <div className="question-meta"><span>{String(current + 1).padStart(2, "0")} / {String(activeCase.questions.length).padStart(2, "0")}</span><span>{question.stage}</span></div><div className="progress-line"><i style={{ width: `${((current + (submitted ? 1 : 0)) / activeCase.questions.length) * 100}%` }} /></div><p className="section-label">{question.kicker}</p><h2>{question.prompt}</h2>
                <div className="choices">{displayedChoices.map(({ choice, originalIndex }, displayIndex) => <button key={choice} className={choiceState(originalIndex)} onClick={() => !submitted && setSelected(originalIndex)} disabled={submitted} aria-pressed={selected === originalIndex}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{choice}</span><i aria-hidden="true">{submitted && originalIndex === question.answer ? "✓" : selected === originalIndex ? "●" : ""}</i></button>)}</div>
                {submitted && <div className={`feedback ${selected === question.answer ? "is-correct" : "is-wrong"}`}><div><b>{selected === question.answer ? `+${points} · 좋은 판단입니다` : "+0 · 감사증거를 다시 연결해 보세요"}</b><span>{question.basis}</span></div><p>{question.explanation}</p></div>}
                <button className="primary" onClick={advance} disabled={selected === null}>{submitted ? (current === activeCase.questions.length - 1 ? "감사보고서 발행" : "다음 감사 절차") : "판단 확정"}<span>→</span></button>
              </article>
              <aside className="progress-card"><p className="section-label">YOUR TRACK</p><div className="rank-ring" style={{ background: `conic-gradient(var(--case-accent) ${nextProgress}%, transparent 0)` }}><div><span>{rank.year}</span><strong>{Math.round(nextProgress)}%</strong></div></div><h3>{nextRank ? `${nextRank.title}까지` : "최고 직급"}<br />{nextRank ? `${nextRank.min - xp} XP` : "도달"}</h3><div className="mini-stats">{Object.entries(stats).map(([label, value]) => <span key={label}>{label} <b>{value}</b></span>)}</div><div className="live-score"><span>CASE SCORE</span><b>{roundedScore}<small>/100</small></b></div></aside>
            </section>
          ) : (
            <section className="result-board" aria-live="polite"><div className="result-score"><p className="section-label">ENGAGEMENT COMPLETE</p><strong>{roundedScore}</strong><span>/ 100</span><h2>{roundedScore >= 80 ? "공시 결과와 정확히 맞췄습니다." : roundedScore >= 60 ? "의견은 맞았고, 절차는 더 날카롭게." : "중요한 단서를 놓쳤습니다."}</h2><p>이번 사건에서 <b>+{earnedXp} XP</b>를 획득했습니다. 점수는 공시 결과와의 일치도를 단순화한 교육 지표이며 유일하게 가능한 감사판단을 뜻하지 않습니다.</p><button className="primary result-button" onClick={openDesk}>다른 기업 감사하기 <span>→</span></button><button className="text-button replay" onClick={() => startCase(activeCase.id)}>이 사건 다시 감사하기 ↻</button></div><div className="report-match"><div className="actual-disclosure">공시에서 확인한 실제 사실</div><div className="match-head"><span>ACTUAL REPORT · {activeCase.reportDate}</span><b>MATCH SHEET</b></div><h3>실제 감사보고서와 대조</h3><ul>{activeCase.report.map(([label, value]) => <li key={label}><span>{label}</span><b>{value}</b><i>✓</i></li>)}</ul><p className="report-note">{activeCase.note}</p><button className="text-button" onClick={() => setSourcesOpen(true)}>공시 원문과 근거 보기 ↗</button></div></section>
          )}
        </>
      )}

      <section className="career-strip"><p className="section-label">CAREER LADDER</p><div className="career-list">{ranks.map((item, index) => <div key={item.title} className={xp >= item.min ? "passed" : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title}</b><small>{item.year} · {item.min.toLocaleString()} XP</small></div>)}</div></section>
      <footer><span>INDEPENDENT EDUCATIONAL PROJECT</span><span>금융감독원·삼일회계법인·사례 기업과 무관한 독립 교육 프로젝트입니다.</span><div><button onClick={() => setSourcesOpen(true)}>출처와 방법론</button><button onClick={() => setNoticeOpen(true)}>이용안내</button></div></footer>
      {sourcesOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSourcesOpen(false)}><section className="source-modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSourcesOpen(false)} aria-label="닫기">×</button><p className="section-label">SOURCE NOTES · CASE {activeCase.number}</p><h2 id="source-title">{activeCase.company}의 공개 공시와 교육용 재구성</h2><p><b>실제 사실:</b> 표시된 수치, 감사의견, 핵심감사사항 및 보고일은 공개된 {activeCase.year}년 사업보고서·감사보고서를 요약했습니다.</p><p><b>가상 부분:</b> 문제의 구체적 상황, 요청자료, 감사절차와 선택지는 교육 목적으로 재구성했으며 해당 기업에서 실제 발생한 사실을 뜻하지 않습니다.</p><div className="source-links">{activeCase.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index + 1).padStart(2, "0")}</span><b>{source.label}</b><small>{source.detail} ↗</small></a>)}</div><div className="api-note"><b>DART API 연결 원칙</b><p>API 키는 서버 비밀값으로만 저장하고 브라우저·코드·로그에 노출하지 않습니다. 원문을 대량 복제하지 않고 필요한 사실을 요약하며 출처를 함께 표시합니다.</p></div></section></div>}
      {noticeOpen && <div className="modal-backdrop notice-backdrop" role="presentation" onMouseDown={closeNotice}><section className="source-modal legal-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={closeNotice} aria-label="닫기">×</button><p className="section-label">BEFORE YOU PLAY</p><h2 id="notice-title">이용 전 꼭 알아두세요.</h2><div className="legal-intro">공개 공시를 감사교육용 게임으로 바꾼 독립 프로젝트입니다. 실제 사실과 가상 상황을 아래 기준으로 구분합니다.</div><div className="legal-list">
        <article><span>01</span><div><b>독립성 및 비제휴</b><p>금융감독원, 삼일회계법인, 사례 기업 또는 관련 임직원이 제작·승인·후원한 서비스가 아닙니다. 기업명과 감사인명은 공개 공시의 사실관계를 설명하기 위해서만 사용합니다.</p></div></article>
        <article><span>02</span><div><b>실제 사실과 가상 상황</b><p>재무수치, 감사의견, 핵심감사사항, 계속기업 관련 결론과 보고일은 출처 공시를 요약합니다. 문제의 상황·선택지·감사절차·대화는 교육 목적으로 만든 가상 재구성이며 실제 사건이나 부정행위를 의미하지 않습니다.</p></div></article>
        <article><span>03</span><div><b>점수의 한계</b><p>점수는 이용자의 선택이 공개된 최종 보고 결과 및 교육용 모범절차와 얼마나 일치하는지를 단순화한 지표입니다. 실제 감사에서는 추가 증거에 따라 다른 전문가적 판단도 합리적일 수 있습니다.</p></div></article>
        <article><span>04</span><div><b>전문가 자문 아님</b><p>본 서비스는 감사·회계·법률·투자 자문이나 실제 감사업무를 제공하지 않으며, 실제 업무 또는 투자판단을 대체하지 않습니다.</p></div></article>
        <article><span>05</span><div><b>데이터 정확성과 시점</b><p>공시 제출인의 책임 아래 공개된 자료를 특정 기준일에 요약합니다. 이후 정정공시나 제도 변경이 반영되지 않을 수 있으므로 중요한 판단에는 반드시 연결된 최신 원문을 확인해야 합니다.</p></div></article>
        <article><span>06</span><div><b>저작권과 상표</b><p>보고서 전문과 기준서 문단을 제공하지 않고 필요한 사실과 개념을 요약합니다. 원문·기업명·상표의 권리는 각 권리자에게 있으며, 로고나 제휴를 암시하는 표지를 사용하지 않습니다.</p></div></article>
        <article><span>07</span><div><b>기록과 개인정보</b><p>현재 XP와 사건 완료기록은 이 브라우저의 로컬 저장공간에만 보관됩니다. 앱은 별도 회원정보나 민감정보를 수집하지 않으며, 호스팅 플랫폼의 접속 처리는 해당 플랫폼 정책을 따릅니다.</p></div></article>
      </div><button className="primary legal-confirm" onClick={closeNotice}>내용을 확인했습니다 <span>✓</span></button></section></div>}
    </main>
  );
}

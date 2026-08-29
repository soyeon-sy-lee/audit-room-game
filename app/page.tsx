"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Question = { stage: string; kicker: string; prompt: string; choices: string[]; answer: number; explanation: string; basis: string; skill: "판단력" | "의구심" | "효율성" };
type AuditCase = {
  id: string; number: string; company: string; code: string; year: string; field: string; category: string; basis: string; summary: string; risk: string; accent: string;
  metrics: [string, string][]; terms: { term: string; meaning: string; why: string }[]; questions: Question[]; reportDate: string; report: [string, string][]; note: string;
  sources: { label: string; detail: string; url: string }[]; factBased?: boolean; fictional?: boolean;
};

const realCases: AuditCase[] = [
  {
    id: "samsung-sds-2023", number: "01", company: "삼성SDS", code: "018260", year: "2023", field: "IT 서비스 · 물류", category: "TECHNOLOGY", basis: "연결 재무제표",
    summary: "공시된 SI 매출 인식 위험과 실제 감사절차를 따라가세요.", risk: "ESTIMATION RISK", accent: "#d7ff37", factBased: true,
    metrics: [["매출", "13.28조"], ["영업이익", "8,082억"], ["총자산", "12.32조"], ["전년 매출", "17.23조"]],
    terms: [
      { term: "SI 프로젝트", meaning: "System Integration의 약자. 고객 업무에 맞춰 여러 정보시스템을 설계·개발·연결하는 장기 프로젝트입니다.", why: "완성까지 여러 달 또는 여러 해가 걸려, 실제로 얼마나 수행했는지에 따라 매출을 나눠 인식하는 경우가 많습니다." },
      { term: "진행률", meaning: "전체 계약 업무 중 결산일까지 수행한 비율입니다. 흔히 실제 투입원가 ÷ 총예정원가로 계산합니다.", why: "총예정원가를 낮게 잡으면 진행률과 당기 매출·이익이 과대계상될 수 있어 감사위험이 큽니다." },
      { term: "계약자산", meaning: "일은 수행했지만 청구조건이 아직 충족되지 않아 고객에게 바로 받을 수 없는 대가입니다.", why: "진행률 추정이 낙관적이면 계약자산도 함께 부풀려질 수 있습니다." },
    ],
    questions: [
      { stage: "위험 평가", kicker: "WHY IT MATTERS", prompt: "삼성SDS 감사보고서가 SI 서비스 진행률을 핵심감사사항으로 선정한 주된 이유는?", choices: ["모든 SI 계약이 결산일에 종료되기 때문에", "미래 노무비·외주비와 프로젝트 변경에 관한 추정과 판단이 진행률에 영향을 주기 때문에", "SI 매출은 전액 현금으로 수취되기 때문에"], answer: 1, explanation: "감사보고서는 총예정원가에 미래 노무비와 외주비 추정이 포함되고, 고객 요청 등에 따라 프로젝트 범위와 계약금액이 변경될 수 있다는 점을 핵심위험의 근거로 설명합니다.", basis: "2023 연결감사보고서 · KAM 선정 이유", skill: "판단력" },
      { stage: "프로세스와 통제", kicker: "UNDERSTAND THE PROCESS", prompt: "이 위험에 대응하기 위해 감사보고서에 기재된 감사절차는?", choices: ["SI 매출 인식 프로세스·회계정책·내부통제를 이해하고 진행률 계산 관련 통제의 설계와 운영 효과성을 테스트한다", "프로젝트 담당자의 구두 설명만 듣고 진행률을 인정한다", "전체 매출을 전년도와 비교하는 것으로 절차를 종료한다"], answer: 0, explanation: "실제 감사인은 SI 서비스 매출 인식 프로세스와 관련 내부통제를 이해하고, 진행률 계산 관련 내부통제의 설계 및 운영 효과성을 테스트했다고 보고했습니다.", basis: "2023 연결감사보고서 · KAM 감사대응", skill: "효율성" },
      { stage: "증빙 검사", kicker: "READ THE EVIDENCE", prompt: "표본 프로젝트의 계약금액·거래조건과 총예정원가를 확인하기 위해 실제 감사인이 검사한 자료는?", choices: ["프로젝트 계약서와 총예정원가 관련 증빙자료", "전사 법인카드 사용명세", "임직원 복리후생비 지급명세"], answer: 0, explanation: "실제 감사인은 표본 프로젝트의 계약서를 검토해 계약금액과 거래조건을 확인하고, 총예정원가 및 관련 증빙자료를 검사했습니다.", basis: "2023 연결감사보고서 · KAM 감사대응", skill: "의구심" },
      { stage: "재계산", kicker: "REPERFORM THE MATH", prompt: "진행률에 따른 매출 인식 금액의 정확성을 검증하기 위해 실제 감사인이 수행한 절차는?", choices: ["회사가 계산한 진행률과 진행률에 따른 매출 인식 금액을 재계산한다", "프로젝트 매출 총액만 재무제표와 대조한다", "경영진확인서만 받고 별도의 계산 검증은 하지 않는다"], answer: 0, explanation: "감사보고서에는 진행률을 재계산하고 진행률에 따른 매출 인식 계산의 정확성을 확인한 것으로 기재돼 있습니다.", basis: "2023 연결감사보고서 · KAM 감사대응", skill: "의구심" },
      { stage: "추정 변경과 보고", kicker: "FOLLOW THE CHANGE", prompt: "결산 전후 총예정원가에 중요한 변경이 있는 프로젝트에 대한 대응과 실제 감사결론을 올바르게 연결한 것은?", choices: ["변경 사유를 질문하고 관련 문서를 검토한다 · 연결재무제표 적정의견", "변경 여부와 관계없이 검토하지 않는다 · 한정의견", "모든 SI 계약을 오류로 간주한다 · 부적정의견"], answer: 0, explanation: "실제 감사인은 총예정원가가 중요하게 변경된 프로젝트를 질문하고 변경의 적정성을 확인했으며, 보고기간 후 중요한 변경도 관련 문서와 함께 검토했습니다. 최종적으로 연결재무제표에 적정의견을 표명했습니다.", basis: "2023 연결감사보고서 · KAM 및 감사의견", skill: "판단력" },
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

const fictionalCases: AuditCase[] = [
  {
    id: "fictional-a", number: "06", company: "커머스 플랫폼 A사", code: "FICTIONAL-A", year: "2025", field: "커머스 플랫폼 · 자체배송", category: "PLATFORM", basis: "완전한 가상 연결 재무제표", fictional: true,
    summary: "중개와 자체배송이 섞인 플랫폼에서 총액·순액과 정산 차이를 풀어내세요.", risk: "REVENUE FLOW RISK", accent: "#ff8f66",
    metrics: [["총거래액", "2.40조"], ["회계상 매출", "3,180억"], ["연간 주문", "2.4억건"], ["기말 미정산", "210억"]],
    terms: [
      { term: "Principal vs Agent", meaning: "플랫폼이 재화·서비스를 고객에게 넘기기 전에 통제하면 본인, 단순 중개하면 대리인으로 판단하는 개념입니다.", why: "본인이면 거래대가를 총액, 대리인이면 수수료를 순액으로 표시할 가능성이 큽니다." },
      { term: "정산채무", meaning: "소비자에게 받은 금액 중 플랫폼이 판매자에게 지급해야 하는 금액입니다.", why: "주문은 존재해도 판매자별 미정산 금액이 누락되면 부채의 완전성이 훼손됩니다." },
      { term: "데이터 대사", meaning: "주문·결제·배송·정산·회계시스템의 건수와 금액 차이를 연결해 설명하는 절차입니다.", why: "데이터 분석 전에 모집단의 완전성과 정확성을 확보하는 출발점입니다." },
    ],
    questions: [
      { stage: "사업 이해", kicker: "MAP THE BUSINESS", prompt: "중개거래와 자체배송거래의 매출 표시를 판단하기 위해 가장 먼저 확인할 것은?", choices: ["고객·판매자·배송업체 계약과 이행책임·가격결정권·재고위험", "플랫폼 앱의 화면 색상과 메뉴 순서", "월별 광고선전비 합계만 전기와 비교"], answer: 0, explanation: "사업모델별로 회사가 재화나 서비스를 이전 전에 통제하는지 파악해야 총액·순액 표시를 판단할 수 있습니다.", basis: "K-IFRS 1115 · 사업모델 이해", skill: "판단력" },
      { stage: "데이터 신뢰성", kicker: "RECONCILE FIRST", prompt: "주문총액·PG 결제액·판매자 정산액·ERP 매출이 서로 다릅니다. 첫 대응은?", choices: ["가장 큰 숫자를 모집단으로 선택한다", "각 데이터의 정의와 추출조건을 확인하고 주문→결제→배송→정산→GL 대사를 만든다", "차이를 전부 오류로 간주해 즉시 의견을 변형한다"], answer: 1, explanation: "취소·환불·쿠폰·부가세·총액과 순액 기준 때문에 숫자가 다를 수 있습니다. 분석 전에 차이의 구조와 데이터 lineage를 확인해야 합니다.", basis: "감사기준서 500 · IPE 신뢰성", skill: "효율성" },
      { stage: "정산 감사", kicker: "FOLLOW THE LIABILITY", prompt: "주문 데이터는 맞지만 판매자 정산 데이터와 차이가 특정 판매자에게 집중됩니다. 우선 절차는?", choices: ["정산채무는 매출과 무관하므로 제외한다", "정산 로직을 재수행하고 설명되지 않는 차이를 판매자별 원장·PG·후속지급과 대조한다", "판매자 수가 많으므로 경영진확인서만 받는다"], answer: 1, explanation: "차이의 정의를 먼저 이해한 뒤 특정 판매자·날짜의 미정산 거래를 추적하면 매출 정확성과 정산채무 완전성을 함께 검토할 수 있습니다.", basis: "감사기준서 500 · 완전성 주장", skill: "의구심" },
      { stage: "기간귀속", kicker: "TEST THE YEAR END", prompt: "12월 30~31일 매출이 급증하고 1월 초 환불이 크게 늘었습니다. 가장 적절한 후속절차는?", choices: ["연말 매출과 익기 환불을 주문번호로 연결하고 실제 배송완료일과 성과보상 구조를 확인한다", "연간 총매출이 예산과 비슷하므로 종료한다", "모든 12월 매출을 자동으로 취소한다"], answer: 0, explanation: "패턴은 부정의 결론이 아니라 발생·기간귀속 위험의 신호입니다. 배송완료와 익기 환불이라는 원증빙으로 위험거래를 검증해야 합니다.", basis: "감사기준서 240 · 330 · 발생·기간귀속", skill: "의구심" },
      { stage: "보고 판단", kicker: "SIGN THE REPORT", prompt: "회사가 총액·순액 오류와 미정산채무를 모두 수정했고 충분한 증거를 확보했습니다. 모범 보고결론은?", choices: ["적정의견 · 플랫폼 매출 및 정산을 핵심감사사항으로 설명", "한정의견 · 수정된 오류도 반드시 의견변형", "의견거절 · 거래량이 많다는 사실만으로 감사불가"], answer: 0, explanation: "발견된 왜곡이 적절히 수정되고 충분하고 적합한 증거를 확보했다면 적정의견이 가능합니다. 거래량 자체가 의견변형 사유는 아닙니다.", basis: "감사기준서 700 · 701", skill: "판단력" },
    ],
    reportDate: "교육용 결산", report: [["모범 감사의견", "적정의견"], ["핵심감사사항", "플랫폼 매출의 총액·순액 및 판매자 정산"], ["중점 주장", "매출 발생·기간귀속 · 정산채무 완전성"], ["왜곡표시", "경영진이 전액 수정"], ["계속기업 중요 불확실성", "해당 없음"]],
    note: "A사와 모든 수치·상황·보고결론은 면접형 감사훈련을 위해 만든 가상 설정입니다.",
    sources: [{ label: "IFRS 15 Revenue", detail: "수익인식 교육 근거 · IFRS Foundation", url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/" }],
  },
  {
    id: "fictional-b", number: "07", company: "기업용 SaaS B사", code: "FICTIONAL-B", year: "2025", field: "B2B SaaS · 구축 · 유지보수", category: "SOFTWARE", basis: "완전한 가상 연결 재무제표", fictional: true,
    summary: "하나의 계약에 묶인 소프트웨어·구축·유지보수의 매출 시점을 판단하세요.", risk: "MULTI-ELEMENT RISK", accent: "#a995ff",
    metrics: [["연간반복매출", "1,260억"], ["계약부채", "420억"], ["계약자산", "190억"], ["기업고객", "780곳"]],
    terms: [
      { term: "수행의무", meaning: "고객에게 구별되는 재화나 서비스를 이전하겠다는 계약상 약속입니다.", why: "소프트웨어·구축·유지보수가 구별되면 거래가격과 매출 인식 시점을 각각 판단해야 합니다." },
      { term: "계약변경", meaning: "계약 범위나 가격이 중간에 추가·수정되는 상황입니다.", why: "별도 계약인지 기존 계약의 수정인지에 따라 미래기간 또는 누적효과 방식이 달라집니다." },
      { term: "서비스 개통 로그", meaning: "고객 계정이 실제로 활성화되고 서비스를 사용할 수 있게 된 시점을 기록한 운영데이터입니다.", why: "청구일보다 실제 서비스 제공 시점이 매출 기간귀속에 더 직접적인 증거가 될 수 있습니다." },
    ],
    questions: [
      { stage: "계약 이해", kicker: "SEPARATE THE PROMISES", prompt: "소프트웨어·초기 구축·3년 유지보수가 한 계약에 포함됐습니다. 첫 회계판단은?", choices: ["계약금액이 크면 전액 즉시 매출로 인식한다", "각 약속이 고객에게 독립적 효익을 주는 구별되는 수행의무인지 판단한다", "유지보수는 항상 광고비로 처리한다"], answer: 1, explanation: "구별되는 수행의무를 식별한 후 거래가격을 배분하고 각 의무가 한 시점 또는 기간에 걸쳐 이행되는지 판단해야 합니다.", basis: "K-IFRS 1115 · 수행의무", skill: "판단력" },
      { stage: "계약변경", kicker: "READ THE MODIFICATION", prompt: "고객이 2년 차에 추가 모듈을 독립가격으로 구매했습니다. 우선 판단할 것은?", choices: ["추가 재화·서비스가 구별되고 가격이 독립판매가격을 반영해 별도 계약인지", "기존 계약은 무조건 전부 취소됐는지", "추가 모듈 개발자의 급여 지급일"], answer: 0, explanation: "계약변경이 별도 계약인지 기존 계약의 일부인지 먼저 판단해야 이후 수익인식 방법을 결정할 수 있습니다.", basis: "K-IFRS 1115 · 계약변경", skill: "판단력" },
      { stage: "데이터 검증", kicker: "TRUST BUT VERIFY", prompt: "회사가 서비스 개통 CSV를 제시했습니다. 감사증거로 사용하기 전에 할 일은?", choices: ["파일명에 FINAL이 있으므로 즉시 신뢰한다", "추출 시스템·쿼리·기간·필드를 이해하고 건수와 금액을 원시스템 및 GL과 대사한다", "Python으로 이상치부터 찾고 대사는 생략한다"], answer: 1, explanation: "정교한 분석도 입력 데이터가 불완전하면 의미가 없습니다. 추출과 변경 가능성까지 포함해 IPE의 신뢰성을 먼저 확인해야 합니다.", basis: "감사기준서 500 · IPE 신뢰성", skill: "효율성" },
      { stage: "기간귀속", kicker: "MATCH GO-LIVE", prompt: "12월 청구분 중 일부 고객의 실제 개통일이 다음 해 1월입니다. 가장 직접적인 절차는?", choices: ["계약서·개통 로그·고객 검수자료를 연결해 서비스 제공 전 매출을 추출한다", "청구서가 발행됐으므로 모두 당기 매출로 인정한다", "전체 계약부채를 매출로 대체한다"], answer: 0, explanation: "청구와 수행의무 이행은 다를 수 있습니다. 실제 개통·검수 시점은 매출 발생과 기간귀속을 검증하는 직접적인 증거입니다.", basis: "감사기준서 330 · K-IFRS 1115", skill: "의구심" },
      { stage: "보고 판단", kicker: "QUALIFY THE OPINION", prompt: "서비스 제공 전 인식한 매출 58억원이 중요하지만 광범위하지 않고, 경영진이 수정을 거부했습니다. 모범 의견은?", choices: ["적정의견", "한정의견", "부적정의견", "의견거절"], answer: 1, explanation: "확인된 왜곡표시가 중요하지만 재무제표 전반에 광범위하지 않다면 한정의견이 적절합니다.", basis: "감사기준서 705 · 중요하지만 광범위하지 않은 왜곡", skill: "판단력" },
    ],
    reportDate: "교육용 결산", report: [["모범 감사의견", "한정의견"], ["한정 근거", "서비스 제공 전 매출 58억원 미수정"], ["핵심 계정", "매출 · 계약자산 · 계약부채"], ["중점 주장", "발생 · 기간귀속 · 정확성"], ["계속기업 중요 불확실성", "해당 없음"]],
    note: "한정·부적정·의견거절은 오류의 성격, 중요성, 광범위성과 증거 확보 여부를 구분해 판단합니다.",
    sources: [{ label: "IFRS 15 Revenue", detail: "수행의무·계약변경 교육 근거 · IFRS Foundation", url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/" }],
  },
  {
    id: "fictional-c", number: "08", company: "생성형 AI C사", code: "FICTIONAL-C", year: "2025", field: "생성형 AI · GPU 인프라", category: "AI", basis: "완전한 가상 연결 재무제표", fictional: true,
    summary: "개발비 자산화와 GPU 장기계약, 자동분개의 통제와 계속기업을 연결하세요.", risk: "CAPITALISATION RISK", accent: "#77d6ff",
    metrics: [["개발지출", "460억"], ["자산화액", "350억"], ["GPU 약정", "620억"], ["실제 성장률", "계획의 40%"]],
    terms: [
      { term: "연구단계와 개발단계", meaning: "대안을 탐색하는 연구단계 지출은 비용이며, 엄격한 요건을 충족한 개발단계 지출만 자산화할 수 있습니다.", why: "기술기업은 성공 기대와 회계상 자산 인식요건을 혼동하기 쉽습니다." },
      { term: "손실계약", meaning: "계약을 이행하는 회피불가능 원가가 기대 경제적 효익을 초과하는 계약입니다.", why: "사용하지 못할 GPU 용량의 장기약정은 충당부채 검토로 이어질 수 있습니다." },
      { term: "Systematic error", meaning: "자동화된 규칙이나 모델의 오류가 전체 거래에 반복적으로 퍼지는 현상입니다.", why: "AI 자동분개에서는 한 건의 예외보다 모델·규칙 변경관리와 감사추적성이 중요합니다." },
    ],
    questions: [
      { stage: "자산화 판단", kicker: "SEPARATE HOPE FROM EVIDENCE", prompt: "개발자 인건비와 GPU 사용료 대부분을 개발비로 자산화했습니다. 가장 먼저 검토할 것은?", choices: ["AI 시장 전망이 밝은지", "프로젝트별 연구·개발 단계 전환시점과 기술적 실현가능성 등 자산 인식요건", "회사의 홍보영상 조회수"], answer: 1, explanation: "사업 성공 가능성과 회계상 자산 인식요건은 별개입니다. 요건을 충족한 시점 이후의 직접 관련 지출만 자산화할 수 있습니다.", basis: "K-IFRS 1038 · 개발비 인식요건", skill: "판단력" },
      { stage: "원가 검증", kicker: "TRACE THE COST", prompt: "프로젝트와 직접 관련된 개발원가인지 검증할 가장 설득력 있는 자료 조합은?", choices: ["개발자 time sheet·프로젝트 코드·GPU 사용 로그·급여 및 클라우드 청구서", "전체 직원 명함 목록", "대표이사의 사업 낙관 의견"], answer: 0, explanation: "자산화된 금액을 프로젝트별 활동과 외부 청구자료까지 추적해야 관련성과 측정의 신뢰성을 검증할 수 있습니다.", basis: "감사기준서 500 · K-IFRS 1038", skill: "의구심" },
      { stage: "장기약정", kicker: "READ THE CAPACITY DEAL", prompt: "서비스 성장 둔화로 계약한 GPU 용량의 절반만 사용할 전망입니다. 우선 감사대응은?", choices: ["계약서·해지조건·실제 사용률·수요전망을 검토하고 리스·손상·손실계약 가능성을 평가한다", "미래 계약이므로 재무제표와 무관하다고 본다", "GPU 계약금액 전부를 즉시 매출로 인식한다"], answer: 0, explanation: "계약의 실질과 회피가능성을 이해하고 관련 자산 손상 및 손실계약 충당부채가 필요한지 평가해야 합니다.", basis: "K-IFRS 1016 · 1036 · 1037", skill: "판단력" },
      { stage: "AI 통제", kicker: "AUDIT THE AGENT", prompt: "AI가 계약서를 읽고 자동분개를 생성합니다. 가장 중요한 통제 조합은?", choices: ["모델·프롬프트·회계규칙 변경 승인, 예외의 사람 검토, 계약서부터 전표까지 audit trail", "AI가 생성했다는 표시만 저장", "오류가 발견되면 해당 한 건만 삭제"], answer: 0, explanation: "자동화는 통제의 강도를 보장하지 않습니다. 변경관리·예외관리·사람의 검토·추적성이 반복 오류를 막는 핵심입니다.", basis: "감사기준서 315 · ITGC·자동통제", skill: "효율성" },
      { stage: "계속기업", kicker: "REPORT THE UNCERTAINTY", prompt: "개발비 오류는 수정됐지만 12개월 내 자금약정 위반 가능성이 높아 중요한 불확실성이 존재하고 주석은 충분합니다. 모범 보고는?", choices: ["적정의견과 계속기업 관련 중요한 불확실성 별도 문단", "부적정의견과 주석 삭제", "의견거절만 표시하고 근거는 생략"], answer: 0, explanation: "계속기업 공시가 충분하다면 의견 자체는 적정일 수 있으며, 중요한 불확실성을 별도 문단으로 이용자에게 알립니다.", basis: "감사기준서 570 · 700", skill: "판단력" },
    ],
    reportDate: "교육용 결산", report: [["모범 감사의견", "적정의견"], ["계속기업 중요 불확실성", "해당 · 별도 문단"], ["핵심감사사항", "개발비 자산화와 GPU 장기약정"], ["왜곡표시", "개발비 오류 수정"], ["주요 증거", "단계판단·time sheet·GPU 로그·자금예측"]],
    note: "계속기업 관련 중요한 불확실성 문단은 그 자체로 한정·부적정의견을 의미하지 않습니다.",
    sources: [{ label: "IAS 38 Intangible Assets", detail: "개발비 교육 근거 · IFRS Foundation", url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-38-intangible-assets/" }, { label: "IAS 36 Impairment", detail: "손상 교육 근거 · IFRS Foundation", url: "https://www.ifrs.org/issued-standards/list-of-standards/ias-36-impairment-of-assets/" }],
  },
  {
    id: "fictional-d", number: "09", company: "디지털 광고 D사", code: "FICTIONAL-D", year: "2025", field: "디지털 광고 · 추천 알고리즘", category: "ADTECH", basis: "완전한 가상 연결 재무제표", fictional: true,
    summary: "클릭 데이터가 매출을 만드는 기업에서 데이터 흐름과 AI 이상탐지의 한계를 감사하세요.", risk: "SYSTEM GENERATED REVENUE", accent: "#ffe04f",
    metrics: [["광고매출", "2,940억"], ["매출 비중", "91%"], ["연간 클릭", "8.2억건"], ["봇 조정률", "4.1%"]],
    terms: [
      { term: "운영데이터", meaning: "클릭·노출·사용시간처럼 회계전표가 생성되기 전 사업시스템에서 만들어지는 비재무 데이터입니다.", why: "클릭 수×단가로 매출이 계산되면 운영데이터의 신뢰성이 매출 감사의 출발점입니다." },
      { term: "ITGC", meaning: "접근권한, 프로그램 변경, 운영 등 애플리케이션 통제의 기반이 되는 전산 일반통제입니다.", why: "자동통제와 인터페이스를 신뢰하려면 기반 시스템의 변경과 접근이 통제되어야 합니다." },
      { term: "False negative", meaning: "실제 위험거래를 분석모델이 정상으로 분류해 놓치는 오류입니다.", why: "이상치가 없다는 결과만으로 감사위험이 낮다고 단정할 수 없는 이유입니다." },
    ],
    questions: [
      { stage: "데이터 흐름", kicker: "FOLLOW THE CLICK", prompt: "클릭 수×계약단가로 광고매출이 자동 계산됩니다. 가장 먼저 이해할 흐름은?", choices: ["광고서버→유효클릭 판정→청구시스템→ERP 인터페이스와 관련 통제", "광고팀 좌석배치→회의실 예약→법인카드", "주가→시가총액→광고주 수"], answer: 0, explanation: "운영데이터가 회계수치로 변환되는 전체 흐름과 자동통제·인터페이스·ITGC를 이해해야 매출 데이터의 신뢰성을 평가할 수 있습니다.", basis: "감사기준서 315 · ITGC·자동통제", skill: "효율성" },
      { stage: "이상치 해석", kicker: "DO NOT JUMP", prompt: "새벽 2~4시에 생성된 매출전표가 많습니다. 바로 부정으로 판단해야 할까요?", choices: ["그렇다. 새벽 전표는 모두 부정이다", "아니다. 자동 배치인지 수동분개인지 구분하고 배치 일정·작성자·승인자를 확인한다", "시간 정보는 항상 삭제한다"], answer: 1, explanation: "24시간 플랫폼의 새벽 자동 배치는 정상일 수 있습니다. 이상치와 오류는 같지 않으므로 사업 프로세스로 해석해야 합니다.", basis: "감사기준서 240 · 전문적 의구심", skill: "의구심" },
      { stage: "AI 분석", kicker: "CHALLENGE THE BLACK BOX", prompt: "설명할 수 없는 AI 모델이 이상 클릭을 선별합니다. 가장 적절한 활용은?", choices: ["모델 결과만으로 매출 발생을 확정한다", "입력·전처리·성능·false negative를 평가하고 위험거래 선별 보조수단으로만 쓴다", "AI가 사람이 만든 것이므로 검증하지 않는다"], answer: 1, explanation: "설명가능성과 재현성이 낮다면 결과에 전적으로 의존하지 않고 계약·외부확인·청구자료 등 다른 증거와 결합해야 합니다.", basis: "감사기준서 500 · 자동화 도구의 한계", skill: "판단력" },
      { stage: "감사범위", kicker: "NO EXCEPTION IS NOT NO RISK", prompt: "전체 클릭을 분석했지만 이상치가 없었습니다. 다음 판단은?", choices: ["해당 계정의 다른 감사절차를 모두 없앤다", "모집단·분석로직·충족한 주장을 평가하고 부족한 발생 증거는 계약·청구·외부증거로 보완한다", "표본을 줄이기 위해 결과를 무조건 신뢰한다"], answer: 1, explanation: "분석은 설정한 조건에서 이상이 없었다는 뜻일 뿐입니다. 어떤 재무제표 주장에 증거를 주는지 구분하고 다른 절차를 설계해야 합니다.", basis: "감사기준서 330 · 500", skill: "판단력" },
      { stage: "보고 판단", kicker: "WHEN EVIDENCE DISAPPEARS", prompt: "연간 광고매출 91%의 원천 클릭로그가 소실돼 대체절차로도 충분한 증거를 얻지 못했습니다. 영향이 중요하고 광범위하다면?", choices: ["적정의견", "한정의견", "의견거절"], answer: 2, explanation: "중요하고 광범위한 영역에서 충분하고 적합한 감사증거를 얻지 못한 범위제한이라면 의견거절이 적절합니다.", basis: "감사기준서 705 · 중요하고 광범위한 범위제한", skill: "판단력" },
    ],
    reportDate: "교육용 결산", report: [["모범 감사의견", "의견거절"], ["근거", "광고매출 원천 클릭로그 소실 및 대체증거 부족"], ["영향 범위", "연간 매출의 91% · 중요하고 광범위"], ["내부통제", "데이터 보존·접근통제의 중요한 미비"], ["핵심 교훈", "데이터 분석 결과보다 데이터 신뢰성이 먼저"]],
    note: "의견거절은 오류가 확인됐다는 뜻이 아니라, 광범위한 영역에 대해 결론을 내릴 충분한 증거를 확보하지 못했다는 의미입니다.",
    sources: [{ label: "Automated Tools and Techniques", detail: "데이터 분석 교육 근거 · IAASB", url: "https://www.iaasb.org/publications/non-authoritative-support-material-using-automated-tools-and-techniques-when-identifying-risks" }],
  },
  {
    id: "fictional-e", number: "10", company: "해외 플랫폼 E사", code: "FICTIONAL-E", year: "2025", field: "크로스보더 플랫폼 · 핀테크", category: "GLOBAL", basis: "완전한 가상 연결 재무제표", fictional: true,
    summary: "급증한 해외매출·채권과 AI 대손모형, 사이버 사고의 재무제표 영향을 추적하세요.", risk: "ECL & CYBER RISK", accent: "#85e0b5",
    metrics: [["해외매출", "1,840억"], ["해외 매출채권", "690억"], ["180일 초과", "124억"], ["AI 산출 ECL", "38억"]],
    terms: [
      { term: "ECL", meaning: "현재 채권에 대해 미래에 발생할 수 있는 신용손실을 확률가중해 추정하는 기대신용손실입니다.", why: "과거 부도율뿐 아니라 국가·고객군과 미래 경제전망을 함께 반영해야 합니다." },
      { term: "Back-testing", meaning: "과거에 예측한 손실률과 이후 실제 부도·회수 결과를 비교하는 검증입니다.", why: "AI 모형이나 경영진 추정의 편향과 성능 저하를 발견하는 데 도움이 됩니다." },
      { term: "우발부채", meaning: "과거 사건에서 생겼지만 미래 불확실한 사건에 따라 존재나 금액이 확정되는 잠재적 의무입니다.", why: "사이버 사고는 과징금·고객보상·소송·보험회수와 공시 문제로 이어질 수 있습니다." },
    ],
    questions: [
      { stage: "해외매출", kicker: "PROVE THE SALE", prompt: "동남아 신규 거래처 매출이 기말에 급증했습니다. 실재성과 기간귀속을 함께 볼 증거는?", choices: ["계약·주문·서비스 완료·외부 정산·입금과 익기 취소 내역", "국가별 매출 성장 목표만", "현지 법인의 구두 설명만"], answer: 0, explanation: "신규 해외매출은 내부 기록뿐 아니라 외부 정산과 입금, 서비스 완료 및 익기 취소까지 연결해 발생과 기간귀속을 검증해야 합니다.", basis: "감사기준서 330 · 500", skill: "의구심" },
      { stage: "데이터 차이", kicker: "STOP AND RECONCILE", prompt: "회사가 준 채권 CSV와 보조원장의 금액이 0.01% 다릅니다. 금액이 작으니 무시할까요?", choices: ["중요성보다 작으므로 원인을 보지 않는다", "차이 원인을 확인하고 단순 반올림인지 시스템 인터페이스 오류인지 판단한다", "CSV를 임의로 수정해 보조원장에 맞춘다"], answer: 1, explanation: "작은 차이라도 시스템 오류라면 다른 거래에 반복될 수 있습니다. 금액뿐 아니라 차이의 원인과 질적 의미를 확인해야 합니다.", basis: "감사기준서 500 · 데이터 완전성·정확성", skill: "효율성" },
      { stage: "채권 평가", kicker: "BUILD THE AGING", prompt: "해외 매출채권의 회수가능성을 평가할 가장 적절한 분석은?", choices: ["고객·국가·연체기간별 aging, 기말 후 회수, 과거 손실률과 미래전망을 결합", "채권 총액을 고객 수로 나눈 평균만 계산", "매출이 증가했으므로 충당금도 자동으로 없앤다"], answer: 0, explanation: "고객군별 신용특성과 실제 후속회수를 확인하고, 과거 데이터에 미래전망을 더해야 기대신용손실의 합리성을 평가할 수 있습니다.", basis: "K-IFRS 1109 · 감사기준서 540", skill: "판단력" },
      { stage: "AI 추정", kicker: "AUDIT THE MODEL", prompt: "AI가 대손충당금을 계산합니다. 감사범위를 가장 완전하게 설명한 것은?", choices: ["모델 이름과 최종 숫자만 확인", "모델·입력데이터·핵심가정·출력·변경승인·back-testing·경영진 overlay를 각각 검토", "AI 결과를 기존 표본감사의 자동 대체로 사용"], answer: 1, explanation: "AI라는 이유로 신뢰하거나 배제하지 않습니다. 모형 거버넌스와 입력 신뢰성, 성능, 가정과 수동조정을 나눠 검증해야 합니다.", basis: "감사기준서 540 · 모델 추정", skill: "판단력" },
      { stage: "사이버 사고와 보고", kicker: "CONNECT THE INCIDENT", prompt: "기말 개인정보 사고의 예상 보상액을 충당부채로 반영하고 충분히 공시했으며, ECL 오류도 수정됐습니다. 사건이 이용자 이해에 근본적이라면?", choices: ["적정의견과 사이버 사고 관련 강조사항 문단", "부적정의견과 모든 채권 제거", "의견거절과 공시 생략"], answer: 0, explanation: "회계처리와 공시가 적정하다면 적정의견이 가능하고, 이용자 이해에 근본적으로 중요한 적정 공시사항은 강조사항으로 주의를 환기할 수 있습니다.", basis: "감사기준서 706 · K-IFRS 1037", skill: "판단력" },
    ],
    reportDate: "교육용 결산", report: [["모범 감사의견", "적정의견"], ["강조사항", "개인정보 사고와 관련 충당부채 공시"], ["핵심감사사항", "해외 매출채권 기대신용손실"], ["왜곡표시", "ECL 오류 수정"], ["계속기업 중요 불확실성", "해당 없음"]],
    note: "사이버 사고는 보안 문제에 그치지 않고 충당부채·우발부채·손상·공시·감사증거 신뢰성으로 연결됩니다.",
    sources: [{ label: "IFRS 9 Financial Instruments", detail: "기대신용손실 교육 근거 · IFRS Foundation", url: "https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/" }],
  },
];

const cases = [...realCases, ...fictionalCases];

const ranks = [
  { min: 0, title: "Associate" },
  { min: 250, title: "Senior Associate" },
  { min: 650, title: "Manager" },
  { min: 1150, title: "Senior Manager" },
  { min: 1850, title: "Director" },
  { min: 2800, title: "Partner" },
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
        <div className="profile"><div><small>{rank.title.toUpperCase()}</small><strong>{xp.toLocaleString()} XP</strong></div><div className="avatar">A</div></div>
      </header>
      <div className="notice-strip"><b>실제 기업 공시</b><span>＋</span><b>완전한 가상 사건</b><p>위쪽은 실제 기업 공시 사건, 아래쪽은 기업명·수치·상황까지 모두 만든 실무 시뮬레이션입니다.</p><button onClick={() => setNoticeOpen(true)}>전체 안내 보기</button></div>

      {screen === "desk" ? (
        <>
          <section className="desk-head"><div><p className="eyebrow">TMT AUDIT · CASE DESK</p><h1>다음 감사는<br /><em>어느 회사입니까?</em></h1><p className="lead">실제 기업 공시 5개와 완전한 가상 실무사건 5개를 한 데스크에서 경험하세요. 사업을 이해하고, 데이터의 신뢰성을 확인한 뒤, 필요한 증거와 최종 보고를 선택합니다.</p></div><div className="desk-count"><strong>{cases.length}</strong><span>PLAYABLE<br />ENGAGEMENTS</span></div></section>
          {[
            { key: "real", label: "REAL FILINGS", title: "실제 기업 공시 사건", description: "공개 사업보고서·감사보고서에서 출발한 다섯 사건입니다. 사실과 교육용 재구성 범위는 각 사건의 배지에서 확인하세요.", items: realCases },
            { key: "fictional", label: "FICTIONAL LAB", title: "완전한 가상 감사사건", description: "면접 대비 질문을 실무형 의사결정으로 바꾼 시뮬레이션입니다. 기업명·수치·상황·결론은 모두 가상입니다.", items: fictionalCases },
          ].map((group) => <section className={`case-collection ${group.key === "fictional" ? "fictional-collection" : ""}`} key={group.key}>
            <div className="case-section-head"><div><p className="section-label">{group.label}</p><h2>{group.title}</h2><p>{group.description}</p></div><strong>{String(group.items.length).padStart(2, "0")}</strong></div>
            <div className="case-grid">{group.items.map((item) => (
              <button className="case-tile" key={item.id} onClick={() => startCase(item.id)} style={{ "--tile-accent": item.accent } as CSSProperties}>
                <div className="tile-top"><span>CASE {item.number} · {item.fictional ? "완전한 가상" : item.factBased ? "공시 기반" : "공시＋교육 재구성"}</span><i>{completedIds.includes(item.id) ? "완료 ✓" : "OPEN →"}</i></div>
                <div className="tile-company"><small>{item.code} · {item.fictional ? "SIMULATION" : `FY${item.year}`}</small><h2>{item.company}</h2><p>{item.field}</p></div>
                <p className="tile-summary">{item.summary}</p><div className="tile-bottom"><span>{item.risk}</span><b>{item.questions.length} DECISIONS</b></div>
              </button>
            ))}</div>
          </section>)}
          <section className="desk-method"><p className="section-label">HOW IT WORKS</p><div><span>01</span><b>사건 유형 확인</b><p>실제 공시와 완전한 가상 사건을 구분해 시작합니다.</p></div><div><span>02</span><b>위험과 증거 연결</b><p>2–5개의 선택지에서 계정·주장·자료·절차를 고릅니다.</p></div><div><span>03</span><b>보고결론 대조</b><p>실제 공시결과 또는 가상 사건의 모범 결론과 비교합니다.</p></div></section>
          <section className="selection-note"><span>CASE SELECTION</span><p>실제 기업 사건은 2023년 이후 삼일회계법인 감사 TMT 기업의 공개 공시를 기준으로 선정했습니다. 가상 사건은 첨부한 면접 대비 질문의 사고방식을 바탕으로 새로 구성했습니다. 본 서비스는 삼일회계법인이 제작·승인·후원한 자료가 아닙니다.</p><button onClick={() => setNoticeOpen(true)}>선정 기준과 비제휴 안내</button></section>
        </>
      ) : (
        <>
          <section className="case-head"><div><button className="back-link" onClick={openDesk}>← CASE DESK</button><p className="eyebrow">{activeCase.fictional ? "FICTIONAL ENGAGEMENT" : "LIVE ENGAGEMENT"} · CASE {activeCase.number}</p><h1>숫자를 믿지 말고,<br /><em>증거를 믿으세요.</em></h1><p className="lead">{activeCase.fictional ? `완전한 가상기업 ${activeCase.company} 감사. ` : `${activeCase.company}의 ${activeCase.year}년 감사. `}{activeCase.summary}</p></div><div className="case-stamp" aria-label={`${activeCase.fictional ? "가상" : activeCase.year} ${activeCase.category} 사건`}><span>{activeCase.fictional ? "LAB" : "FY"}</span><strong>{activeCase.fictional ? "SIM" : activeCase.year}</strong><small>TMT · {activeCase.category}</small></div></section>
          {screen === "case" ? (
            <section className="workspace" aria-live="polite">
              <aside className="case-file"><p className="section-label">CLIENT BRIEF</p><div className="client-title"><span>{activeCase.code}</span><h2>{activeCase.company}</h2></div><p>{activeCase.field}<br />{activeCase.basis}</p><dl>{activeCase.metrics.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><div className="risk-chip">{activeCase.risk} <b>HIGH</b></div><p className="data-note">{activeCase.fictional ? "모든 수치·상황은 교육용 가상 설정" : `단위 반올림 · ${activeCase.year} 기준`}</p></aside>
              <article className="question-card">
                <details className="term-brief" defaultOpen key={activeCase.id}>
                  <summary><span>먼저 읽는 산업·감사용어</span><b>{activeCase.terms.length}개 용어 <i>＋</i></b></summary>
                  <div className="term-grid">{activeCase.terms.map((item) => <div key={item.term}><strong>{item.term}</strong><p>{item.meaning}</p><small><b>왜 중요할까?</b> {item.why}</small></div>)}</div>
                </details>
                <div className="scenario-disclosure"><b>{activeCase.fictional ? "완전한 가상 감사사건" : activeCase.factBased ? "공시 기반 감사문제" : "교육용 가상 감사상황"}</b><span>{activeCase.fictional ? "기업명·식별코드·수치·상황·보고결론을 모두 면접형 감사훈련을 위해 만들었습니다." : activeCase.factBased ? "문제의 사실관계와 정답은 공개 감사보고서의 위험·수행절차·결론을 요약했습니다. 오답 선택지는 교육용입니다." : "아래 상황과 선택지는 감사 훈련을 위해 재구성했습니다. 해당 기업에서 실제로 발생한 사실이나 부정행위를 의미하지 않습니다."}</span></div>
                <div className="question-meta"><span>{String(current + 1).padStart(2, "0")} / {String(activeCase.questions.length).padStart(2, "0")}</span><span>{question.stage}</span></div><div className="progress-line"><i style={{ width: `${((current + (submitted ? 1 : 0)) / activeCase.questions.length) * 100}%` }} /></div><p className="section-label">{question.kicker}</p><h2>{question.prompt}</h2>
                <div className="choices">{displayedChoices.map(({ choice, originalIndex }, displayIndex) => <button key={choice} className={choiceState(originalIndex)} onClick={() => !submitted && setSelected(originalIndex)} disabled={submitted} aria-pressed={selected === originalIndex}><b>{String.fromCharCode(65 + displayIndex)}</b><span>{choice}</span><i aria-hidden="true">{submitted && originalIndex === question.answer ? "✓" : selected === originalIndex ? "●" : ""}</i></button>)}</div>
                {submitted && <div className={`feedback ${selected === question.answer ? "is-correct" : "is-wrong"}`}><div><b>{selected === question.answer ? `+${points} · 좋은 판단입니다` : "+0 · 감사증거를 다시 연결해 보세요"}</b><span>{question.basis}</span></div><p>{question.explanation}</p></div>}
                <button className="primary" onClick={advance} disabled={selected === null}>{submitted ? (current === activeCase.questions.length - 1 ? "감사보고서 발행" : "다음 감사 절차") : "판단 확정"}<span>→</span></button>
              </article>
              <aside className="progress-card"><p className="section-label">YOUR TRACK</p><div className="rank-ring" style={{ background: `conic-gradient(var(--case-accent) ${nextProgress}%, transparent 0)` }}><div><span>CURRENT GRADE</span><strong>{Math.round(nextProgress)}%</strong></div></div><h3>{nextRank ? `${nextRank.title}까지` : "최고 직급"}<br />{nextRank ? `${nextRank.min - xp} XP` : "도달"}</h3><div className="mini-stats">{Object.entries(stats).map(([label, value]) => <span key={label}>{label} <b>{value}</b></span>)}</div><div className="live-score"><span>CASE SCORE</span><b>{roundedScore}<small>/100</small></b></div></aside>
            </section>
          ) : (
            <section className="result-board" aria-live="polite"><div className="result-score"><p className="section-label">ENGAGEMENT COMPLETE</p><strong>{roundedScore}</strong><span>/ 100</span><h2>{roundedScore >= 80 ? (activeCase.fictional ? "모범 감사결론과 정확히 맞췄습니다." : "공시 결과와 정확히 맞췄습니다.") : roundedScore >= 60 ? "의견은 맞았고, 절차는 더 날카롭게." : "중요한 단서를 놓쳤습니다."}</h2><p>이번 사건에서 <b>+{earnedXp} XP</b>를 획득했습니다. 점수는 {activeCase.fictional ? "교육용 모범절차" : "공시 결과"}와의 일치도를 단순화한 지표이며 유일하게 가능한 감사판단을 뜻하지 않습니다.</p><button className="primary result-button" onClick={openDesk}>다른 기업 감사하기 <span>→</span></button><button className="text-button replay" onClick={() => startCase(activeCase.id)}>이 사건 다시 감사하기 ↻</button></div><div className="report-match"><div className="actual-disclosure">{activeCase.fictional ? "교육용 가상 결론" : "공시에서 확인한 실제 사실"}</div><div className="match-head"><span>{activeCase.fictional ? "FICTIONAL CASE RESOLUTION" : `ACTUAL REPORT · ${activeCase.reportDate}`}</span><b>MATCH SHEET</b></div><h3>{activeCase.fictional ? "가상 사건의 모범 보고결론" : "실제 감사보고서와 대조"}</h3><ul>{activeCase.report.map(([label, value]) => <li key={label}><span>{label}</span><b>{value}</b><i>✓</i></li>)}</ul><p className="report-note">{activeCase.note}</p><button className="text-button" onClick={() => setSourcesOpen(true)}>{activeCase.fictional ? "교육 근거와 가상 설정 보기" : "공시 원문과 근거 보기"} ↗</button></div></section>
          )}
        </>
      )}

      <section className="career-strip"><p className="section-label">CAREER LADDER</p><div className="career-list">{ranks.map((item, index) => <div key={item.title} className={xp >= item.min ? "passed" : ""}><span>{String(index + 1).padStart(2, "0")}</span><b>{item.title}</b><small>{item.min.toLocaleString()} XP</small></div>)}</div><p className="career-note">직급 순서는 삼일PwC 공개 자료에서 확인되는 명칭을 따릅니다. XP 승진 기준은 게임 진행을 위한 설정이며 실제 승진 요건과 무관합니다.</p></section>
      <footer><span>INDEPENDENT EDUCATIONAL PROJECT</span><span>금융감독원·삼일회계법인·사례 기업과 무관한 독립 교육 프로젝트입니다.</span><div><button onClick={() => setSourcesOpen(true)}>출처와 방법론</button><button onClick={() => setNoticeOpen(true)}>이용안내</button></div></footer>
      {sourcesOpen && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSourcesOpen(false)}><section className="source-modal" role="dialog" aria-modal="true" aria-labelledby="source-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setSourcesOpen(false)} aria-label="닫기">×</button><p className="section-label">SOURCE NOTES · CASE {activeCase.number}</p><h2 id="source-title">{activeCase.company}의 {activeCase.fictional ? "완전한 가상 감사사건" : activeCase.factBased ? "공개 공시 기반 사건" : "공개 공시와 교육용 재구성"}</h2><p><b>{activeCase.fictional ? "가상 설정:" : "실제 사실:"}</b> {activeCase.fictional ? "기업명, 식별코드, 재무수치, 감사상황과 최종 보고결론은 모두 교육 목적으로 만든 설정이며 어떠한 실제 기업도 지칭하지 않습니다." : `표시된 수치, 감사의견, 핵심감사사항 및 보고일은 공개된 ${activeCase.year}년 사업보고서·감사보고서를 요약했습니다.`}</p><p><b>{activeCase.fictional ? "문제 구성:" : activeCase.factBased ? "문제 구성:" : "가상 부분:"}</b> {activeCase.fictional ? "첨부한 TMT·데이터 감사 면접 대비 질문의 사고방식을 객관식 의사결정으로 재구성했습니다. 하나의 모범 경로를 제시하지만 실제 감사에서는 추가 증거에 따라 다른 판단도 가능합니다." : activeCase.factBased ? "사실관계와 정답은 감사보고서에 기재된 핵심위험·감사인의 수행절차·보고결론을 요약했으며, 오답 선택지만 교육 목적으로 구성했습니다." : "문제의 구체적 상황, 요청자료, 감사절차와 선택지는 교육 목적으로 재구성했으며 해당 기업에서 실제 발생한 사실을 뜻하지 않습니다."}</p><div className="source-links">{activeCase.sources.map((source, index) => <a href={source.url} target="_blank" rel="noreferrer" key={source.url}><span>{String(index + 1).padStart(2, "0")}</span><b>{source.label}</b><small>{source.detail} ↗</small></a>)}</div><div className="api-note"><b>{activeCase.fictional ? "교육 근거 사용 원칙" : "DART API 연결 원칙"}</b><p>{activeCase.fictional ? "기준서와 면접자료의 원칙을 요약해 사용하며, 특정 실제 회사의 내부사정이나 미공개 사실을 가정하지 않습니다." : "API 키는 서버 비밀값으로만 저장하고 브라우저·코드·로그에 노출하지 않습니다. 원문을 대량 복제하지 않고 필요한 사실을 요약하며 출처를 함께 표시합니다."}</p></div></section></div>}
      {noticeOpen && <div className="modal-backdrop notice-backdrop" role="presentation" onMouseDown={closeNotice}><section className="source-modal legal-modal" role="dialog" aria-modal="true" aria-labelledby="notice-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={closeNotice} aria-label="닫기">×</button><p className="section-label">BEFORE YOU PLAY</p><h2 id="notice-title">이용 전 꼭 알아두세요.</h2><div className="legal-intro">실제 기업의 공개 공시 사건과 완전한 가상 감사사건을 분리한 독립 교육 프로젝트입니다.</div><div className="legal-list">
        <article><span>01</span><div><b>독립성 및 비제휴</b><p>금융감독원, 삼일회계법인, 사례 기업 또는 관련 임직원이 제작·승인·후원한 서비스가 아닙니다. 기업명과 감사인명은 공개 공시의 사실관계를 설명하기 위해서만 사용합니다.</p></div></article>
        <article><span>02</span><div><b>사건 유형과 사실 구분</b><p>위쪽 실제 기업 사건은 공개 공시와 교육용 재구성 범위를 개별 표시합니다. 아래쪽 가상 사건은 기업명·코드·수치·상황·모범결론까지 모두 창작했으며 실제 기업이나 사건을 지칭하지 않습니다.</p></div></article>
        <article><span>03</span><div><b>점수의 한계</b><p>점수는 이용자의 선택이 공개된 최종 보고 결과 또는 가상 사건의 교육용 모범절차와 얼마나 일치하는지를 단순화한 지표입니다. 실제 감사에서는 추가 증거에 따라 다른 전문가적 판단도 합리적일 수 있습니다.</p></div></article>
        <article><span>04</span><div><b>전문가 자문 아님</b><p>본 서비스는 감사·회계·법률·투자 자문이나 실제 감사업무를 제공하지 않으며, 실제 업무 또는 투자판단을 대체하지 않습니다.</p></div></article>
        <article><span>05</span><div><b>데이터 정확성과 시점</b><p>공시 제출인의 책임 아래 공개된 자료를 특정 기준일에 요약합니다. 이후 정정공시나 제도 변경이 반영되지 않을 수 있으므로 중요한 판단에는 반드시 연결된 최신 원문을 확인해야 합니다.</p></div></article>
        <article><span>06</span><div><b>저작권과 상표</b><p>보고서 전문과 기준서 문단을 제공하지 않고 필요한 사실과 개념을 요약합니다. 원문·기업명·상표의 권리는 각 권리자에게 있으며, 로고나 제휴를 암시하는 표지를 사용하지 않습니다.</p></div></article>
        <article><span>07</span><div><b>기록과 개인정보</b><p>현재 XP와 사건 완료기록은 이 브라우저의 로컬 저장공간에만 보관됩니다. 앱은 별도 회원정보나 민감정보를 수집하지 않으며, 호스팅 플랫폼의 접속 처리는 해당 플랫폼 정책을 따릅니다.</p></div></article>
      </div><button className="primary legal-confirm" onClick={closeNotice}>내용을 확인했습니다 <span>✓</span></button></section></div>}
    </main>
  );
}

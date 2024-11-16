const express = require("express");
const router = express.Router();
const axios = require("axios");
const ExcelJS = require("exceljs");
const asyncHandler = require("express-async-handler");
const path = require("path");
const crypto = require('crypto');
require('dotenv').config();

// 레이아웃 설정
const mainLayout = "../views/layouts/main.ejs";
const homeLayout = "../views/layouts/home.ejs";

// 키워드 리서치 메인 페이지
router.get("/keyword", asyncHandler(async (req, res) => {
    const locals = {
        title: "키워드 리서치",
        description: "네이버 연관검색어 및 자동완성 키워드 분석 도구"
    };
    
    res.render("keyword/index", {
        locals,
        layout: homeLayout,
        member: res.locals.member
    });
}));

// 키워드 분석 API 엔드포인트
router.post("/keyword/analyze", asyncHandler(async (req, res) => {
    try {
        const { keywords } = req.body;
        const queries = keywords.split(',').map(q => q.trim()).filter(q => q);
        
        if (queries.length > 50) {
            return res.status(400).json({
                success: false,
                message: "키워드는 최대 50개까지만 입력 가능합니다."
            });
        }

        // 엑셀 워크북 생성
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('검색결과');
        
        // 컬럼 설정
        worksheet.columns = [
            { header: '검색어', width: 15 },
            { header: '연관 키워드', width: 30 }
        ];

        let currentRow = 2; // 헤더 다음 행부터 시작

        for (const query of queries) {
            // 자동완성 키워드 수집
            const autoCompleteUrl = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(query)}&st=100&frm=nx&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&ans=2&run=2&rev=4&q_enc=UTF-8`;
            const autoCompleteResponse = await axios.get(autoCompleteUrl);
            const autoCompleteKeywords = autoCompleteResponse.data.items[0].map(item => item[0]);

            // 자동완성 키워드 추가
            for (const keyword of autoCompleteKeywords) {
                worksheet.getCell(`A${currentRow}`).value = query;
                worksheet.getCell(`B${currentRow}`).value = keyword;
                currentRow++;
            }

            // 연관 검색어 수집
            const searchUrl = `https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURIComponent(query)}`;
            const searchResponse = await axios.get(searchUrl, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const cheerio = require('cheerio');
            const $ = cheerio.load(searchResponse.data);
            
            // 연관 검색어 추가
            $('ul.lst_related_srch li.item').each((index, element) => {
                const keyword = $(element).find('.tit').text().trim();
                if (keyword) {
                    worksheet.getCell(`A${currentRow}`).value = query;
                    worksheet.getCell(`B${currentRow}`).value = keyword;
                    currentRow++;
                }
            });

            // API 호출 간 딜레이
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // 엑셀 파일을 버퍼로 생성
        const buffer = await workbook.xlsx.writeBuffer();
        
        // 응답 전송
        res.json({
            success: true,
            data: buffer.toString('base64'),
            message: '분석이 완료되었습니다.'
        });

    } catch (error) {
        console.error('에러 발생:', error);
        res.status(500).json({
            success: false,
            message: '분석 중 오류가 발생했습니다.'
        });
    }
}));

// 키워드 분석 결과 이력 조회 (옵션)
router.get("/keyword/history", asyncHandler(async (req, res) => {
    // 향후 확장을 위한 이력 조회 기능
    res.render("keyword/history", {
        locals: {
            title: "분석 이력",
            description: "키워드 분석 이력"
        },
        layout: homeLayout,
        member: res.locals.member
    });
}));

// 에러 처리 미들웨어
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        message: '서버 오류가 발생했습니다.',
        layout: homeLayout,
        member: res.locals.member
    });
});

// 네이버 검색광고 API 설정
const searchAdConfig = {
    baseUrl: process.env.BASE_URL,
    apiKey: process.env.API_KEY,
    secretKey: process.env.SECRET_KEY,
    customerId: process.env.CUSTOMER_ID
};

// API 헤더 생성 함수
function getSearchAdHeaders(method, path) {
    const timestamp = Date.now();
    const signature = crypto
        .createHmac('sha256', searchAdConfig.secretKey)
        .update(`${timestamp}.${method}.${path}`)
        .digest('base64');

    return {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Timestamp': timestamp,
        'X-API-KEY': searchAdConfig.apiKey,
        'X-Customer': searchAdConfig.customerId,
        'X-Signature': signature
    };
}

// 키워드 검색 API 엔드포인트
router.post("/keyword/searchad", async (req, res) => {
    try {
        const { keyword } = req.body;
        if (!keyword) {
            return res.status(400).json({ error: '키워드를 입력해주세요' });
        }

        const path = '/keywordstool';
        const response = await axios({
            method: 'GET',
            url: `${searchAdConfig.baseUrl}${path}`,
            headers: getSearchAdHeaders('GET', path),
            params: {
                hintKeywords: keyword,
                showDetail: '1'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error('API 에러:', error);
        res.status(500).json({ error: '키워드 분석 중 오류가 발생했습니다.' });
    }
});

// 엑셀 다운로드 라우트
router.post("/keyword/download", asyncHandler(async (req, res) => {
    try {
        const { data } = req.body;
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('키워드 분석 결과');

        // 헤더 설정
        worksheet.columns = [
            { header: '키워드', key: 'keyword', width: 20 },
            { header: 'PC 검색수', key: 'pcSearches', width: 15 },
            { header: '모바일 검색수', key: 'mobileSearches', width: 15 },
            { header: '검색수 합계', key: 'totalSearches', width: 15 },
            { header: 'PC 클릭수', key: 'pcClicks', width: 15 },
            { header: '모바일 클릭수', key: 'mobileClicks', width: 15 },
            { header: 'PC 클릭률', key: 'pcClickRate', width: 15 },
            { header: '모바일 클릭률', key: 'mobileClickRate', width: 15 }
        ];

        // 스타일 설정
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        // 데이터 추가
        data.forEach(item => {
            const pcSearches = item.monthlyPcQcCnt === '<10' ? 5 : parseInt(item.monthlyPcQcCnt);
            const mobileSearches = item.monthlyMobileQcCnt === '<10' ? 5 : parseInt(item.monthlyMobileQcCnt);
            
            worksheet.addRow({
                keyword: item.relKeyword,
                pcSearches: item.monthlyPcQcCnt,
                mobileSearches: item.monthlyMobileQcCnt,
                totalSearches: pcSearches + mobileSearches,
                pcClicks: item.monthlyAvePcClkCnt,
                mobileClicks: item.monthlyAveMobileClkCnt,
                pcClickRate: item.monthlyPcQcCnt === '0' ? '0.00%' : 
                    ((parseInt(item.monthlyAvePcClkCnt) / pcSearches) * 100).toFixed(2) + '%',
                mobileClickRate: item.monthlyMobileQcCnt === '0' ? '0.00%' : 
                    ((parseInt(item.monthlyAveMobileClkCnt) / mobileSearches) * 100).toFixed(2) + '%'
            });
        });

        // 모든 셀 테두리 설정
        worksheet.eachRow((row, rowNumber) => {
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=keyword_analysis.xlsx');

        await workbook.xlsx.write(res);
    } catch (error) {
        console.error('엑셀 생성 에러:', error);
        res.status(500).json({ error: '엑셀 파일 생성 중 오류가 발생했습니다.' });
    }
}));
module.exports = router;
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const Mart = require('../models/Mart'); // Mart 모델 경로를 적절히 수정하세요

// 이미지 파일이 있는 디렉토리 경로
const imageDir = path.join(__dirname, '..', 'public', 'img', 'product-image');

// 이미지 파일 목록 가져오기
const getImageFiles = () => {
  return fs.readdirSync(imageDir)
    .filter(file => file.startsWith('product_sample_image'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\((\d+)\)/)[1]);
      const numB = parseInt(b.match(/\((\d+)\)/)[1]);
      return numA - numB;
    });
};

// Mart 데이터 업데이트 함수
const updateMartData = async () => {
  const imageFiles = getImageFiles();
  const marts = await Mart.find({});

  for (let i = 0; i < marts.length; i++) {
    const mart = marts[i];
    const thumbnails = imageFiles.slice(i * 3, (i + 1) * 3);

    mart.thumbnail1 = `/img/product-image/${thumbnails[0]}`;
    mart.thumbnail2 = thumbnails[1] ? `/img/product-image/${thumbnails[1]}` : mart.thumbnail1;
    mart.thumbnail3 = thumbnails[2] ? `/img/product-image/${thumbnails[2]}` : mart.thumbnail1;

    await mart.save();
  }

  return `Updated ${marts.length} Mart documents`;
};

// 업데이트 엔드포인트
router.get('/update-thumbnails', async (req, res) => {
  try {
    const result = await updateMartData();
    res.send(result);
  } catch (error) {
    console.error('Error updating Mart data:', error);
    res.status(500).send('Error updating Mart data');
  }
});

module.exports = router;
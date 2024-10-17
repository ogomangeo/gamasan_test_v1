function updatePrice(martIndex) {
    const select = document.getElementById(`optionSelect-${martIndex}`);
    const priceSpan = document.getElementById(`selectedPrice-${martIndex}`);
    const selectedOptionIndex = select.value;
    const selectedOption = martOptions[martIndex][selectedOptionIndex];
    
    if (selectedOption) {
      priceSpan.textContent = selectedOption.price.toLocaleString();
    }
  }
  
  // 페이지 로드 시 각 상품의 초기 가격을 설정
  document.addEventListener('DOMContentLoaded', function() {
    Object.keys(martOptions).forEach(martIndex => {
      updatePrice(martIndex);
    });
  });
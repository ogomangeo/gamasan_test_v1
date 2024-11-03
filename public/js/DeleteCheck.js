//admin 메뉴에서 삭제 확인 자바스크립트

/**
 * 게시물 삭제 전 확인
 * @param {string} id - 게시물 ID
 * @param {string} type - 게시물 타입 (notice, program, blog, archive, event)
 * @returns {boolean} - 확인 시 true, 취소 시 false
 */
function deleteConfirm(id, type) {
    const message = '정말 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.';
    return confirm(message);
}
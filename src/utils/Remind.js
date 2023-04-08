function remind(content, title, object) {
  object.$alert(content, title, {
    confirmButtonText: '确定'
  })
};

export default remind;
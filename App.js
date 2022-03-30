let temp = 0;

window.setInterval(() => {
  console.log(`temp = ${temp}`);
  document.querySelector('.test-div').textContent = String(temp)
  temp++;
}, 500);

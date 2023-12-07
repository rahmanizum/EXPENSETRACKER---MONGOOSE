const array = [1, 2, 3, 4, 5];

array.forEach(element => {
  if (element === 3) {
    // Skip processing for the element with value 3
    return;
  }

  console.log(element);
});


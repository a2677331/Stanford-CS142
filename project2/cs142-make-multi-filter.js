"use strict";

function cs142MakeMultiFilter(originalArray) {
  // make copy of original array
  let currentArray = [...originalArray];

  // Define a function for later return
  const arrayFilterer = (filterCriteria, callback) => {
    // if filterCriteria is not function type, return original array immediately,
    if (typeof filterCriteria !== "function") {
      return currentArray;
    }

    // Use filterCriteria function to filter the array
    currentArray = currentArray.filter(filterCriteria);

    // if callback is Not a function type, then return itself
    if (typeof callback === "function") {
      // callback's this should reference the value of originalArray
      callback = callback.bind(originalArray); 
      callback(currentArray);
    }
    // Use callback function and let callback's "this" point to originalArray
    return arrayFilterer;
  };

  // returns a function that can be used to filter the elements of array
  return arrayFilterer;
}

/* Below is testing functions */

// Invoking cs142MakeMultiFilter() with originalArray = [1, 2, 3] returns a
// function, saved in the variable arrayFilterer1, that can be used to
// repeatedly filter the input array
var arrayFilterer1 = cs142MakeMultiFilter([1, 2, 3]);

// Call arrayFilterer1 (with a callback function) to filter out all the numbers
// not equal to 2.
arrayFilterer1(
  function (elem) {
    return elem !== 2; // check if element is not equal to 2
  },
  function (currentArray) {
    // 'this' within the callback function should refer to originalArray which is [1, 2, 3]
    console.log(this); // prints [1, 2, 3]
    console.log(currentArray); // prints [1, 3]
  },
);

// Call arrayFilterer1 (without a callback function) to filter out all the
// elements not equal to 3.
arrayFilterer1(function (elem) {
  return elem !== 3; // check if element is not equal to 3
});

// Calling arrayFilterer1 with no filterCriteria should return the currentArray.
var currentArray = arrayFilterer1();
console.log("currentArray", currentArray); // prints [1] since we filtered out 2 and 3

// Since arrayFilterer returns itself, calls can be chained
function filterTwos(elem) {
  return elem !== 2;
}
function filterThrees(elem) {
  return elem !== 3;
}
var arrayFilterer2 = cs142MakeMultiFilter([1, 2, 3]);
var currentArray2 = arrayFilterer2(filterTwos)(filterThrees)();
console.log("currentArray2", currentArray2); // prints [1] since we filtered out 2 and 3

// Multiple active filters at the same time
var arrayFilterer3 = cs142MakeMultiFilter([1, 2, 3]);
var arrayFilterer4 = cs142MakeMultiFilter([4, 5, 6]);
console.log(arrayFilterer3(filterTwos)()); // prints [1, 3]
console.log(arrayFilterer4(filterThrees)()); // prints [4, 5, 6]

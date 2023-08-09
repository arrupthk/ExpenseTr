// const expenseForm = document.getElementById('expense-form');
// expenseForm.addEventListener('submit', addExpense);

// function parseJwt(token) {
//   var base64Url = token.split('.')[1];
//   var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
//     return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//   }).join(''));

//   return JSON.parse(jsonPayload);
// }

// window.onload = async function () {
//     const token = localStorage.getItem('token');
//     const page = 1;
//     const pageSize = localStorage.getItem('pageSize');
  
//     const decodeToken = parseJwt(token);
//     console.log(decodeToken);
//     const isAdmin = decodeToken.ispremiumuser;
//     if (isAdmin) {
//       premiumFeatures();
//       showPageSizeOptions(); // Show page size options for premium users
//       showPaginationOptions(); // Show pagination options for premium users
//     } else {
//       const downloadReportButton = document.getElementById('downloadReportButton');
//       downloadReportButton.style.display = 'none'; // Hide the "Download Report" button for non-premium users
  
//       const pageSizeContainer = document.querySelector('.btn-group.container.bg-primary');
//       pageSizeContainer.style.display = 'none'; // Hide the page size options container for non-premium users
  
//       const paginationContainer = document.getElementById('pagination');
//       paginationContainer.style.display = 'none'; // Hide the pagination container for non-premium users
//     }
  
//     try {
//       let response;
//       if (isAdmin) {
//         response = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${pageSize}`, {
//           headers: { 'Authorization': token }
//         });
//       } else {
//         response = await axios.get(`http://localhost:5000/expense/getExpense`, {
//           headers: { 'Authorization': token }
//         });
//       }
  
//       response.data.allExpense.forEach(expense => {
//         showOnScreen(expense);
//       });
  
//       showPagination(response.data);
//     } catch (error) {
//       console.log("Error loading expenses:", error);
//     }
//   };
  
//   function showPageSizeOptions() {
//     const pageSizeContainer = document.querySelector('.btn-group.container.bg-primary');
//     pageSizeContainer.style.display = 'block'; 
//   }
  
//   function showPaginationOptions() {
//     const paginationContainer = document.getElementById('pagination');
//     paginationContainer.style.display = 'block'; 
//   }
  
//   async function pageSize(val) {
//   try {
//     const token = localStorage.getItem('token');
//     localStorage.setItem('pageSize', `${val}`);
//     const page = 1;
//     const res = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${val}`,
//       { headers: { 'Authorization': token } });
//     showPagination(res.data);
//   }
//   catch (err) {
//     console.log(err);
//   }
// }

// async function addExpense(event) {
//   event.preventDefault();

//   const expense = {
//     name: event.target.name.value,
//     description: event.target.description.value,
//     category: event.target.category.value,
//     amount: event.target.amount.value,
//     userId: 1
//   };

//   console.log(expense, "printing from front end");
//   const token = localStorage.getItem('token');

//   try {
//     const response = await axios.post('http://localhost:5000/expense/postExpense', expense, {
//       headers: { 'Authorization': token }
//     });
//     console.log(response)
//     console.log("Expense data sent to the server:", response.data.expense);
//     showOnScreen(response.data.expense);
//     expenseForm.reset();


//   } catch (error) {
//     console.log("Error sending expense data:", error);
//   }
// }

// function showOnScreen(expense) {
//   const expensesList = document.getElementById('expenses');
//   const expenseid = `expense-${expense.id}`;
//   const li = document.createElement('li');
//   li.textContent = ` id- ${expense.id} - ${expense.name} - ${expense.description} - ${expense.category} - ${expense.amount}`;
//   expensesList.appendChild(li);

//   const delb = document.createElement('input');
//   delb.type = "button";
//   delb.value = "delete";
//   delb.onclick = async () => {
//     const token = localStorage.getItem('token');

//     li.remove();
//     try {
//       const response = await axios.delete(`http://localhost:5000/expense/deleteExpense/${expense.id}`, {
//         headers: { 'Authorization': token }
//       });
//       console.log("Deleting id", response);
//     } catch (error) {
//       console.log("Error deleting expense:", error);
//     }
//   };
//   li.appendChild(delb);
//   expensesList.appendChild(li);
// }

// document.getElementById('razorpay').onclick = async function (e) {
//   const token = localStorage.getItem('token');

//   try {
//     const response = await axios.get(`http://localhost:5000/purchase/premiumMembership`, {
//       headers: { 'Authorization': token }
//     });
//     console.log(response);
//     var options = {
//       "key": response.data.key_id,
//       "order_id": response.data.order.id,
//       "handler": async function (response) {
//         await axios.post(`http://localhost:5000/purchase/transactionStatus`,
//           { order_id: options.order_id, payment_id: response.razorpay_payment_id }, {
//           headers: { 'Authorization': token }
//         });
//         alert("congratulations! You are a prime user now.");
//         premiumFeatures();
//       }
//     };

//     const razor = new Razorpay(options);
//     razor.open();
//     e.preventDefault();

//     razor.on('payment.failed', async function (response) {
//       await axios.post('http://localhost:5000/purchase/transactionStatus', {
//         status: "failed",
//         order_id: options.order_id,
//         payment_id: response.razorpay_payment_id
//       }, { headers: { 'Authorization': token } });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// };

// function premiumFeatures() {
//   document.getElementById('message').innerHTML = 'you are a premium user now';
//   const leaderButton = document.getElementById('razorpay');
//   leaderButton.innerHTML = 'Show Leaderboard';
//   leaderButton.onclick = async () => {
//     const token = localStorage.getItem('token');

//     try {
//       const response = await axios.get('http://localhost:5000/purchase/leaderboard', {
//         headers: { 'Authorization': token }
//       });

//       const leaderboardData = response.data.data;

//       document.getElementById('message').innerHTML = '';

//       leaderboardData.forEach(item => {
//         const li = document.createElement('li');
//         li.className = 'listleaders';
//         li.textContent = `Name: ${item.name} ; Total Expense: ${item.totalexpense}`;
//         document.getElementById('message').appendChild(li);
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   };
// }

// async function downloadReport() {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.get('http://localhost:5000/expense/download-report', { headers: { "Authorization": token } });
//     console.log('here is the response', response)
//     if (response.status === 200) {
//       const fileUrl = response.data.fileUrl;

//       // Create a temporary link element
//       const a = document.createElement("a");
//       a.href = response.data.fileUrl;
//       a.download = 'myexpense.txt';
//       a.click();
//     } else {
//       console.log("error in downloading")
//       throw new Error(response.data.message);
//     }
//   } catch (err) {
//     console.log(err, " printing the error in downloading")
//   }
// }

// async function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
//   try {
//     const pagination = document.getElementById('pagination');
//     pagination.innerHTML = '';

//     const createButton = (pageNum) => {
//       const btn = document.createElement('button');
//       btn.innerHTML = pageNum;
//       btn.addEventListener('click', () => getExpenses(pageNum));
//       pagination.appendChild(btn);
//     };

//     if (hasPreviousPage) {
//       createButton(previousPage);
//     }

//     createButton(currentPage);

//     if (hasNextPage) {
//       createButton(nextPage);
//     }

//     if (currentPage !== lastPage && lastPage !== nextPage) {
//       createButton(lastPage);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// async function getExpenses(page) {
//   try {
//     const token = localStorage.getItem('token');
//     const pageSize = localStorage.getItem('pageSize');
//     const response = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${pageSize}`, {
//       headers: { 'Authorization': token }
//     });
//     const expenses = response.data.allExpense;
//     const expensesList = document.getElementById('expenses');
//     expensesList.innerHTML = '';
//     expenses.forEach(expense => {
//       showOnScreen(expense);
//     });
//     showPagination(response.data);
//   } catch (err) {
//     console.log(err);
//   }
// }


const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit', addExpense);

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

window.onload = async function () {
    const token = localStorage.getItem('token');
    const page = 1;
    const pageSize = localStorage.getItem('pageSize');
  
    const decodeToken = parseJwt(token);
    console.log(decodeToken);
    const isAdmin = decodeToken.ispremiumuser;
    if (isAdmin) {
      premiumFeatures();
      showPageSizeOptions(); // Show page size options for premium users
      showPaginationOptions(); // Show pagination options for premium users
    } else {
      const downloadReportButton = document.getElementById('downloadReportButton');
      downloadReportButton.style.display = 'none'; // Hide the "Download Report" button for non-premium users
  
      const pageSizeContainer = document.querySelector('.btn-group.container.bg-primary');
      pageSizeContainer.style.display = 'none'; // Hide the page size options container for non-premium users
  
      const paginationContainer = document.getElementById('pagination');
      paginationContainer.style.display = 'none'; // Hide the pagination container for non-premium users
    }
  
    try {
      let response;
      if (isAdmin) {
        response = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${pageSize}`, {
          headers: { 'Authorization': token }
        });
      } else {
        response = await axios.get(`http://localhost:5000/expense/getExpense`, {
          headers: { 'Authorization': token }
        });
      }
  
      response.data.allExpense.forEach(expense => {
        showOnScreen(expense);
      });
  
      showPagination(response.data);
    } catch (error) {
      console.log("Error loading expenses:", error);
    }
  };
  
  function showPageSizeOptions() {
    const pageSizeContainer = document.querySelector('.btn-group.container.bg-primary');
    pageSizeContainer.style.display = 'block'; 
  }
  
  function showPaginationOptions() {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.style.display = 'block'; 
  }
  
  async function pageSize(val) {
  try {
    const token = localStorage.getItem('token');
    localStorage.setItem('pageSize', `${val}`);
    const page = 1;
    const res = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${val}`,
      { headers: { 'Authorization': token } });
    showPagination(res.data);
  }
  catch (err) {
    console.log(err);
  }
}

async function addExpense(event) {
  event.preventDefault();

  const expense = {
    name: event.target.name.value,
    description: event.target.description.value,
    category: event.target.category.value,
    amount: event.target.amount.value,
    userId: id
  };

  console.log(expense);
  const token = localStorage.getItem('token');

  try {
    const response = await axios.post('http://localhost:5000/expense/postExpense', expense, {
      headers: { 'Authorization': token }
    });
    console.log("Expense data sent to the server:", response.data.expense);
    showOnScreen(response.data.expense);
    expenseForm.reset();


  } catch (error) {
    console.log("Error sending expense data:", error);
  }
}

function showOnScreen(expense) {
  const expensesList = document.getElementById('expenses');
  const expenseid = `expense-${expense.id}`;
  const li = document.createElement('li');
  li.textContent = ` id- ${expense.id} - ${expense.name} - ${expense.description} - ${expense.category} - ${expense.amount}`;
  expensesList.appendChild(li);

  const delb = document.createElement('input');
  delb.type = "button";
  delb.value = "delete";
  delb.onclick = async () => {
    const token = localStorage.getItem('token');

    li.remove();
    try {
      const response = await axios.delete(`http://localhost:5000/expense/deleteExpense/${expense.id}`, {
        headers: { 'Authorization': token }
      });
      console.log("Deleting id", response);
    } catch (error) {
      console.log("Error deleting expense:", error);
    }
  };

  li.appendChild(delb);
  expensesList.appendChild(li);
}

document.getElementById('razorpay').onclick = async function (e) {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get(`http://localhost:5000/purchase/premiumMembership`, {
      headers: { 'Authorization': token }
    });
    console.log(response);
    var options = {
      "key": response.data.key_id,
      "order_id": response.data.order.id,
      "handler": async function (response) {
        await axios.post(`http://localhost:5000/purchase/transactionStatus`,
          { order_id: options.order_id, payment_id: response.razorpay_payment_id }, {
          headers: { 'Authorization': token }
        });
        alert("congratulations! You are a prime user now.");
        premiumFeatures();
      }
    };

    const razor = new Razorpay(options);
    razor.open();
    e.preventDefault();

    razor.on('payment.failed', async function (response) {
      await axios.post('http://localhost:5000/purchase/transactionStatus', {
        status: "failed",
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id
      }, { headers: { 'Authorization': token } });
    });
  } catch (err) {
    console.log(err);
  }

};

function premiumFeatures() {
  document.getElementById('message').innerHTML = 'you are a premium user now';
  const leaderButton = document.getElementById('razorpay');
  leaderButton.innerHTML = 'Show Leaderboard';
  leaderButton.onclick = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await axios.get('http://localhost:5000/purchase/leaderboard', {
        headers: { 'Authorization': token }
      });

      const leaderboardData = response.data.data;

      document.getElementById('message').innerHTML = '';

      leaderboardData.forEach(item => {
        const li = document.createElement('li');
        li.className = 'listleaders';
        li.textContent = `Name: ${item.name} ; Total Expense: ${item.totalexpense}`;
        document.getElementById('message').appendChild(li);
      });
    } catch (error) {
      console.log(error);
    }
  };
}



async function downloadReport() {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:5000/expense/download-report', { headers: { "Authorization": token } });
    console.log('here is the response', response)
    if (response.status === 200) {
      const fileUrl = response.data.fileUrl;

      // Create a temporary link element
      const a = document.createElement("a");
      a.href = response.data.fileUrl;
      a.download = 'myexpense.txt';
      a.click();
    } else {
      console.log("error in downloading")
      throw new Error(response.data.message);
    }
  } catch (err) {
    console.log(err, " printing the error in downloading")
  }
}

async function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage }) {
  try {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const createButton = (pageNum) => {
      const btn = document.createElement('button');
      btn.innerHTML = pageNum;
      btn.addEventListener('click', () => getExpenses(pageNum));
      pagination.appendChild(btn);
    };

    if (hasPreviousPage) {
      createButton(previousPage);
    }

    createButton(currentPage);

    if (hasNextPage) {
      createButton(nextPage);
    }

    if (currentPage !== lastPage && lastPage !== nextPage) {
      createButton(lastPage);
    }
  } catch (err) {
    console.log(err);
  }
}

async function getExpenses(page) {
  try {
    const token = localStorage.getItem('token');
    const pageSize = localStorage.getItem('pageSize');
    const response = await axios.get(`http://localhost:5000/expense/getExpense?page=${page}&pageSize=${pageSize}`, {
      headers: { 'Authorization': token }
    });
    const expenses = response.data.allExpense;
    const expensesList = document.getElementById('expenses');
    expensesList.innerHTML = '';
    expenses.forEach(expense => {
      showOnScreen(expense);
    });
    showPagination(response.data);
  } catch (err) {
    console.log(err);
  }
}
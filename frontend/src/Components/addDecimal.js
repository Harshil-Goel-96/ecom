export const addDecimal = (num) => {
    return (Math.round(Number(num) * 100) / 100).toFixed(2);
}

//console.log(typeof addDecimal(345.7654));
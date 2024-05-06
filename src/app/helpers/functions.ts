export const money = (n: string) => {
  let Currency = {
    decimals: 0,
    prefix: "$",
    suffix: "",
    thousands: ",",
    decimal: ".",
  };

  let c = Currency.decimals,
    d = Currency.decimal,
    t = Currency.thousands,
    s = +n < 0 ? "-" : "",
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = i.length;

  j = j > 3 ? j % 3 : 0;
  let formattedVal =
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${t}`) +
    (c
      ? d +
        Math.abs(+n - parseInt(i))
          .toFixed(c)
          .slice(2)
      : "");

  return Currency.prefix + formattedVal + Currency.suffix;
};

export const uuidv4 = function () {
  return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
    (
      +c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
    ).toString(16)
  );
};

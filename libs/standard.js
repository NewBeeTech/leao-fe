export function getStandard(age) {
  let standard = [];
  switch(age) {
    case 3:
      standard = [{param1: 5, param2: 9.1, param3: null, param4: 64.6, param5: 8.6},
                  {param1: 5, param2: 9.4, param3: null, param4: 61.8, param5: 8.4}];
      break;
    case 4:
      standard = [{param1: 8, param2: 8, param3: null, param4: 80.4, param5: 6.1},
                  {param1: 8, param2: 8.3, param3: null, param4: 76.6, param5: 6.1}];
      break;
    case 5:
      standard = [{param1: 10, param2: 7.1, param3: null, param4: 96.7, param5: 4.2},
                  {param1: 10, param2: 7.4, param3: null, param4: 90.7, param5: 4.2}];
      break;
    case 6:
      standard = [{param1: 15, param2: 6.6, param3: 8.1, param4: 107.9, param5: 3.2},
                  {param1: 15, param2: 7, param3: 9.5, param4: 100.1, param5: 3.1}];
      break;
    case 7:
      standard = [{param1: 20, param2: 6.2, param3: 9.7, param4: 122.3, param5: 2.8},
                  {param1: 20, param2: 10.2, param3: 11, param4: 114.3, param5: 2.7}];
      break;
    case 8:
      standard = [{param1: 25, param2: 6.0, param3: 11.3, param4: 133.1, param5: 2.5},
                  {param1: 25, param2: 10.3, param3: 13, param4: 124.4, param5: 2.4}];
      break;
    case 9:
      standard = [{param1: 32.5, param2: 5.3, param3: 12.3, param4: 141.0, param5: 2.2},
                  {param1: 32.5, param2: 9.7, param3: 14, param4: 131.9, param5: 2.2}];
      break;
    case 10:
      standard = [{param1: 32.5, param2: 4.6, param3: 13.3, param4: 148.4, param5: 2.2},
                  {param1: 32.5, param2: 9.5, param3: 15, param4: 139.9, param5: 2.1}];
      break;
    case 11:
      standard = [{param1: 32.5, param2: 4.4, param3: 14.1, param4: 156.9, param5: 2.1},
                  {param1: 32.5, param2: 9.5, param3: 15.5, param4: 147.1, param5: 2.0}];
      break;
    case 12:
      standard = [{param1: 32.5, param2: 4.3, param3: 14.0, param4: 169.4, param5: 2.0},
                  {param1: 32.5, param2: 9.5, param3: 16, param4: 152.3, param5: 1.9}];
      break;
    case 13:
      standard = [{param1: 32.5, param2: 5.9, param3: 14.5, param4: 185.6, param5: 2.0},
                  {param1: 32.5, param2: 10.7, param3: 16.5, param4: 156.7, param5: 1.9}];
      break;
    case 14:
      standard = [{param1: 32.5, param2: 7.2, param3: 15.1, param4: 198.9, param5: 1.9},
                  {param1: 32.5, param2: 11.5, param3: 18, param4: 159.5, param5: 1.8}];
      break;
    case 15:
      standard = [{param1: 32.5, param2: 9.1, param3: 15.7, param4: 212.2, param5: 1.9},
                  {param1: 32.5, param2: 12.6, param3: 19, param4: 164.5, param5: 1.8}];
      break;
    case 16:
      standard = [{param1: 32.5, param2: 10.1, param3: 15.8, param4: 219.9, param5: 1.9},
                  {param1: 32.5, param2: 13.2, param3: 21, param4: 166.0, param5: 1.8}];
      break;
    case 17:
      standard = [{param1: 32.5, param2: 10.6, param3: 15.8, param4: 224.2, param5: 1.9},
                  {param1: 32.5, param2: 13.4, param3: 22, param4: 166.5, param5: 1.8}];
      break;
    case 18:
      standard = [{param1: 32.5, param2: 11.0, param3: 15.4, param4: 225.8, param5: 1.9},
                  {param1: 32.5, param2: 13.6, param3: 24, param4: 166.2, param5: 1.8}];
      break;
  }
  return standard;
}

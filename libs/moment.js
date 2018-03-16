export function getNextNDay(AddDayCount) {
     let dd = new Date();
     dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
     let year = dd.getFullYear();
     let month = dd.getMonth()+1;//获取当前月份的日期
     let date = dd.getDate();
     let day = '';
     switch(dd.getDay()) {
       case 0:
         day = '周日';
         break;
         case 1:
           day = '周一';
           break;
           case 2:
             day = '周二';
             break;
             case 3:
               day = '周三';
               break;
               case 4:
                 day = '周四';
                 break;
                 case 5:
                   day = '周五';
                   break;
                   case 6:
                     day = '周六';
                     break;
     }
     return ({
       year,
       month,
       date,
       day,
     });
}

import DatePicker from 'vue-datepicker-next';
import ptBR from 'date-format-parse/es/locale/pt-br';

const lang = {
  formatLocale: ptBR,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('pt-br', lang);

export default lang;

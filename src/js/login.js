import '../css/login.css';
import '@grapecity/wijmo.styles/themes/wijmo.theme.material.css';
import '@grapecity/wijmo';
import { ComboBox } from '@grapecity/wijmo.input';

var users = 'Chloe Hunt,Patrick Russell,Alisa Malone,Kendal Herbert'.split(',');

var theCombo = new ComboBox('#userDropdown', {
    itemsSource: users,
    placeholder: "Users"
})
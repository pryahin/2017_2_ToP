import Form from '../../components/Form/Form';

const data = {
    title: 'Авторизация',
    icon: 'fa fa-lock',
    method: 'post',
    name: 'loginForm',
    fields: [
        {
            type: 'text',
            name: 'form-username',
            placeholder: 'Логин...',
            class: 'loginput'
        },
        {
            type: 'password',
            name: 'form-password',
            placeholder: 'Пароль...',
            class: 'loginput'
        }
    ],
    buttons: [
        {
            class: 'loginSubmit',
            text: 'Войти!'
        }
    ]
};

export default class SignIn extends Form {
    constructor() {
        super(data);
    }

    init() {
        this.renderTo('content');
        this.validation('loginput', 'loginSubmit', 'loginForm');
    }
}


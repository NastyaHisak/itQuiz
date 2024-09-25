import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Answers {
    constructor() {
        this.quiz = null,
            this.answersQuestion = null,

            this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        const userInfo = Auth.getUserInfo();
        document.getElementById('answers-person-span').innerText = userInfo.fullName + ', ' + localStorage.getItem('email');
        document.getElementById('pass').onclick = () => {
            location.href = `#/result?id=${this.routeParams.id}`
        }
        if (!userInfo) {
            location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    this.quiz = result;
                    document.getElementById('pre-title').innerText = this.quiz.test.name;

                    this.showAnswer();
                    this.isCorrect();

                    return;
                }
            } catch (error) {
                console.log(error)
            }
        }

    }

    showAnswer() {
        this.answersQuestion = document.getElementById('answers-question');
        this.questionTitleElement = document.getElementById('title');
        this.answersQuestion = document.getElementById('answers-question');


        this.quiz.test.questions.forEach((quiz, i) => {
            const answerItem = document.createElement('div');
            answerItem.className = 'answers-item';

            const title = document.createElement('div');
            title.className = 'answers-question-title';
            title.innerHTML = `<span>Вопрос ${i + 1}</span> ${quiz.question}`;

            answerItem.appendChild(title);

            const answersQuestionOptions = document.createElement('div');
            answersQuestionOptions.className = 'answers-question-options';


            quiz.answers.forEach(item => {

                const answersQuestionItem = document.createElement('div');
                answersQuestionItem.className = 'answers-question-item';

                const inputElement = document.createElement('input');
                inputElement.setAttribute('id', item.id);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', 'answer-' + item.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', item.id);
                labelElement.innerText = item.answer;

                answersQuestionItem.appendChild(inputElement);
                answersQuestionItem.appendChild(labelElement);

                answersQuestionOptions.appendChild(answersQuestionItem);

            })

            answerItem.appendChild(answersQuestionOptions);
            this.answersQuestion.appendChild(answerItem);

        });
    }

    isCorrect() {
        let questions = this.quiz.test.questions;

        questions.forEach(question => {
            question.answers.forEach(answer => {
                let answerId = document.getElementById(answer.id);
                let label = answerId.nextSibling;

                if (answer.correct === true) {
                    answerId.style.borderColor = '#5FDC33';
                    answerId.style.borderWidth = '6px';
                    label.style.color = '#5FDC33';
                } else if (answer.correct === false) {
                    answerId.style.borderColor = '#DC3333';
                    answerId.style.borderWidth = '6px';
                    label.style.color = '#DC3333';
                } else {
                    answerId.style.borderColor = '#6933DC';
                    answerId.style.borderWidth = '3px';
                    label.style.color = '#333333';
                }

            })
        })
    }
}





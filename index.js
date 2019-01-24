#!/usr/bin/env node

const chalk = require("chalk");
const figlet = require("figlet");
const validator = require("email-validator");
const axios = require("axios");
const ora = require("ora");
const omae = require("omaewa");

omae();

const [, , ...args] = process.argv;

console.log(
    chalk.yellowBright.bgBlack(
        figlet.textSync("OmaeWa..Mou", {
            font: "ANSI Shadow",
            horizontalLayout: "default",
            verticalLayout: "default"
        })
    )
);

if (validator.validate(`${args}`) == true) {
    console.log(chalk.bgGreen.black(`L'email : ${args} est bien valide. \n`));

    const spinner = ora({
        text: 'Shindeiru',
        spinner: {
            interval: 80,
            frames: [
                "3o",
                "3=D",
                "3==D",
                "3===D",
                "3====D"
            ]
        }
    });

    spinner.color = 'yellow';

    spinner.start();

    axios({
            method: "get",
            url: `https://haveibeenpwned.com/api/v2/breachedaccount/${args}`,
            headers: {
                "user-agent": "omaewa"
            }
        })
        .then(function (response) {
            spinner.succeed("NANI ?!");
            response.data.forEach(function (breach) {
                console.log(chalk.bgBlack.yellowBright(breach.Name));
                console.log(chalk.bgBlack.yellowBright(breach.Domain));
                console.log(breach.Description);
            });
        })

        .catch(function (error) {
            spinner.succeed("NANI ?!");
            if (error.response) {
                console.log(chalk.black.bgGreen(`Aucun soucis sur cette adresse \n`));
            } else {
                console.log(chalk.bgRed(`C'est la merde mec ! `));
            }
        });
} else {
    console.log(chalk.black.bgRed(`L'email ${args} n'est pas valide bro. :/`));
}
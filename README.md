
# HawHawLab
![](https://i.imgur.com/QuIa2FT.png)
#### A backtesting website that empowers users with coding experience to design their logic-based strategies for stock market analysis and testing.
* Code or Submit Form your strategy.
* Save and update the strategy that you created.
* Real-Time Order Placement with Price or Indicators, and Profit Report for Strategies

> Website URL: https://hawhawlab.com

---

## Table of Contents
* [Technologies](#Technologies)
* [Architecture](#Architecture)
* [Database schema](#Database-schema)
* [Main features](#Main-features)
* [Demo accounts](#Demo-accounts)

## Technologies
### Back-End
![TypeScript](https://img.shields.io/badge/TypeScript-black?logo=typescript&logoColor=%233178C6)
![JavaScript](https://img.shields.io/badge/JavaScript-black?logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-black?logo=nodedotjs&logoColor=%23339933)
![Express](https://img.shields.io/badge/Express-black?logo=express&logoColor=White)
* VM process
* RESTful API
### Front-End
![Static Badge](https://img.shields.io/badge/React-black?logo=react&logoColor=%2361DAFB)
![Static Badge](https://img.shields.io/badge/Tailwind%20CSS-black?logo=tailwindcss&logoColor=%2306B6D4)

### Cloud Service (AWS)
* EC2
* RDS
* ElasticCache
* Elastic Load Balancer
* AWS EventBridge
* Lambda

### Database
![Static Badge](https://img.shields.io/badge/MySQL-black?logo=mysql&logoColor=%234479A1)
![Static Badge](https://img.shields.io/badge/Redis-black?logo=redis&logoColor=%23DC382D)

### Networking
* HTTPS
* SSL
* Domain Name System (DNS)

### Tools
* Version Control: Git, GitHub, Docker
* Test: Jest
* Agile: Trello

### Others
* Design Pattern: MVC

## Architecture

![](https://i.imgur.com/XVZBmI0.png)

## Database schema

![](https://i.imgur.com/WdidofN.png)

## Main features
* Stock detail
    * Lookup historical stock prices and investment information.
    * Automate the update process at 23:30 by utilizing AWS EventBridge and Lambda to refresh the current stock information.


https://github.com/Howard1209/HawHawLab/assets/111356655/aad1ac64-d7d4-4429-a8fc-506096f5819a


* Login
    * Users can log in to access full features of the platform.
        * Utilize strategy script and form to create trading strategies.
        * Perform CRUD (Create, Read, Update, Delete) operations on strategies.


* Strategy script
    * Empower users with a coding environment to create their own logic-based strategies using the VM (Virtual Machine) process.
    * Offer a comprehensive grammar and documentation for users to reference.


https://github.com/Howard1209/HawHawLab/assets/111356655/bff4ea66-f26a-4b8e-8953-8a99792af023



* CRUD strategy



https://github.com/Howard1209/HawHawLab/assets/111356655/1601bffc-2a42-4123-a965-f6a2a1c1469b



* Strategy Form



https://github.com/Howard1209/HawHawLab/assets/111356655/d6c2d235-af70-41ea-bcd9-dd318fb1fbb3



## Demo accounts
| Email | Password     |
| :-------- | :------- |
| hh@gmail.com | qwe1234|


# HawHawLab
![](https://i.imgur.com/QuIa2FT.png)
#### A backtesting website that empowers users with coding experience to design their logic-based strategies for stock market analysis and testing.
* Code or Submit Form your strategy.
* Save and update the strategy that you created.
* Real-Time Order Placement with Price or Indicators, and Profit Report for Strategies

> Website URL: https://hawhawlab.com

---

## Table of Contents
* [Technologies](#technologies)
* [Architecture](#architecture)
* [Database schema](#database-schema)
* [Main features](#main-features)
* [Demo accounts](#demo-accounts)

## Technologies
### Back-End
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![codemirror](https://img.shields.io/badge/CodeMirror-D30707?style=for-the-badge&logo=CodeMirror&logoColor=white)
![jwt](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
* VM process
* RESTful API
### Front-End
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![tailwindcss](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![ChartJS](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)

### Cloud Service (AWS)
* EC2
* RDS
* ElasticCache
* Elastic Load Balancer
* AWS EventBridge
* Lambda

### Database
![mysql](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![redis](https://img.shields.io/badge/redis-%23DD0031.svg?&style=for-the-badge&logo=redis&logoColor=white)

### Networking
* HTTPS
* SSL
* Domain Name System (DNS)

### Tools
![git](https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white)
![github](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white)
![babel](https://img.shields.io/badge/Babel-F9DC3E?style=for-the-badge&logo=babel&logoColor=white)
![trello](https://img.shields.io/badge/Trello-0052CC?style=for-the-badge&logo=trello&logoColor=white)

### Others
* Design Pattern: MVC

## Architecture

![](https://i.imgur.com/XVZBmI0.png)

## Database schema

![](https://i.imgur.com/WdidofN.png)

## Main features
* Stock detail
    * Lookup historical stock prices and investment information.
    * Automate the update process at 21:00 by utilizing AWS EventBridge and Lambda to refresh the current stock information.


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

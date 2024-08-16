# Localmart


## [See the App!](www.your-deploy-url-here.com)


## Description


**LocalMart es una plataforma digital que conecta a los consumidores con los negocios locales de su comunidad.**.


#### [https://github.com/Marcocar97/localmart-client]

#### [https://github.com/Marcocar97/localmart-server]


## Backlog Functionalities


**NOTE -** Expansión de Funcionalidades: Implementación de notificaciones personalizadas y reseñas de usuarios.

App Móvil: Adaptar LocalMart a dispositivos móviles para una experiencia más completa.

Marketing: Ampliar la base de usuarios y comerciantes a través de estrategias de marketing digital.


## Technologies used


**NOTE -** Backend: Node.js, Express.js para la API.

Base de Datos: MongoDB para el almacenamiento de datos de usuarios y ofertas



# Server Structure


## Models


User model


```javascript

{

  {

    name: { type: String, required: [true, "Name is required."] },

    email: {

      type: String,

      required: [true, "Email is required."],

      unique: true,

      lowercase: true,

      trim: true,

    },

    password: { type: String, required: [true, "Password is required."] },

    favorites: [{ type: Schema.Types.ObjectId, ref: "Offer" }],

  }


}

```


Business Model


```javascript

{

    businessName: {

      type: String,

      required: [true, "Business name is required."],

    },

    description: { type: String, required: [true, "Description is required."] },

    category: { type: String, required: [true, "Category is required."] },

    location: { type: String, required: [true, "Location is required."] },

    logo: { type: String },

    email: {

      type: String,

      required: [true, "Email is required."],

      unique: true,

      lowercase: true,

      trim: true,

    },

    password: { type: String, required: [true, "Password is required."] },

  }

```


Offer model


```javascript

{

    offerName: { type: String, required: [true, "Offer name is required."] },

    description: { type: String, required: [true, "Description is required."] },

    availability: {

      type: String,

      required: [true, "Availability is required."],

    },

    schedules: { type: String, required: [true, "Schedules are required."] },

    image: { type: String },

    business: {

      type: Schema.Types.ObjectId,

      ref: "Business",

      required: [true, "Business reference is required."],

    },

  }

```


Reservation model


```javascript

{

    confirmationNumber: {

      type: String,

      required: true

    },

    createDate: { type: Date, default: Date.now },

    offer: {

      type: Schema.Types.ObjectId,

      ref: "Offer",

      required: true

    },

    user: {

      type: Schema.Types.ObjectId,

      ref: "User",

      required: true

    },

  }

```


## API Endpoints (Backend Routes) | HTTP Method | URL | Request Body | Success Status | Error Status | Description | | ----------- | --------------------------- | ------------------------------------------------ | -------------- | ------------ | --------------------------------------------------- | | POST | `/auth/signup` | `{name, email, password}` | 201 | 400 | Registers the user in the database | | POST | `/auth/login` | `{email, password}` | 200 | 400 | Authenticates user and returns a token | | GET | `/auth/verify` | | 200 | 401 | Verifies the user token | | GET | `/home` | | 200 | 400 | Retrieves business logos | | GET | `/business` | | 200 | 400 | Lists all businesses | | POST | `/signup/user` | `{name, email, password}` | 201 | 400 | Registers a new user | | POST | `/signup/business` | `{businessName, description, category, location, logo, email, password}` | 201 | 400 | Registers a new business | | POST | `/login/user` | `{email, password}` | 200 | 400 | Authenticates user and returns a token | | POST | `/login/business` | `{email, password}` | 200 | 400 | Authenticates business and returns a token | | GET | `/verify` | | 200 | 401 | Verifies the token validity | | GET | `/user-profile` | | 200 | 401 | Retrieves user profile details | | PUT | `/user-profile` | `{name, email, password}` | 200 | 400, 401 | Updates user profile | | DELETE | `/user-profile` | | 200 | 401 | Deletes user profile | | GET | `/business-profile` | | 200 | 401 | Retrieves business profile details | | PUT | `/business-profile` | `{businessName, description, category, location, logo}` | 200 | 400, 401 | Updates business profile | | DELETE | `/business-profile` | | 200 | 401 | Deletes business profile | | POST | `/business-offer` | `{offerName, description, availability, schedules, image}` | 201 | 400 | Adds a new offer to the business | | GET | `/business-offers` | | 200 | 400 | Retrieves all offers for the business | | PUT | `/business-offers/:offerId` | `{offerName, description, availability, schedules, image}` | 200 | 400, 401 | Updates a specific offer | | DELETE | `/business-offers/:offerId` | | 200 | 401 | Deletes a specific offer | | GET | `/user-offers` | | 200 | 400 | Retrieves all available offers | | GET | `/user-offers/:offerId` | | 200 | 400 | Retrieves details of a specific offer | | GET | `/user-reservas` | | 200 | 400 | Retrieves all user reservations | | DELETE | `/user-reservas/:reservaId` | | 200 | 401 | Deletes a specific reservation | | GET | `/user-reservas/:reservaId` | | 200 | 401 | Retrieves details of a specific reservation | | GET | `/user-favorites` | | 200 | 401 | Retrieves all favorite offers | | PATCH | `/user-favorites/:offerId` | | 200 | 401 | Adds or removes an offer from favorites | | POST | `/user-reservas` | `{offerId, userId, date, time}` | 201 | 400 | Creates a new reservation |

  

## Links


### Created by


[Marcos Cardoza - www.github.com/Marcocar97]




### Project


[https://github.com/Marcocar97/localmart-client]


[https://github.com/Marcocar97/localmart-serve]


[https://localmart.netlify.app/]


### Slides


[https://www.canva.com/design/DAGN_4KYMas/fY-J7Z_5SelV_cXszDHWWw/edit?utm_content=DAGN_4KYMas&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton]


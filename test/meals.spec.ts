import crypto from 'node:crypto'
import request from 'supertest'
import { afterAll, beforeAll, describe, it } from 'vitest'
import { app } from '../src/app'

describe('Meals routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to list all meals plan of user', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server).get('/meals').set('Cookie', cookie).expect(200)
  })

  it('should be able to create a new meal plan', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookie)
      .send({
        name: 'New meal plan',
        description: 'Its my new plan',
        mealInterval: 'Its my nee meal interval',
        inDiet: true,
      })
      .expect(201)
  })

  it('should be able to update a meal plan', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookie).send({
      id: crypto.randomUUID(),
      name: 'New meal plan',
      description: 'Its my new plan',
      mealInterval: 'Its my nee meal interval',
    })

    const getMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = getMealResponse.body.meals.shift().id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .send({
        name: 'Other name meal plan',
        description: 'Other description',
        mealInterval: 'at 5hr',
        inDiet: false,
      })
      .expect(200)
  })

  it('should be able to delete a meal plan', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookie).send({
      id: crypto.randomUUID(),
      name: 'New meal plan',
      description: 'Its my new plan',
      mealInterval: 'Its my nee meal interval',
    })

    const getMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = getMealResponse.body.meals.shift().id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(200)
  })

  it('should be able to get a specific meal plan', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookie).send({
      id: crypto.randomUUID(),
      name: 'New meal plan',
      description: 'Its my new plan',
      mealInterval: 'Its my nee meal interval',
    })

    const getMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookie)
      .expect(200)

    const mealId = getMealResponse.body.meals.shift().id

    await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookie)
      .expect(200)
  })

  it('should be able to generate a summary of the meals plan', async () => {
    const createUserResponse = await request(app.server).post('/users').send({
      name: 'New user',
      email: 'newuser@gmail.com',
      password: 'newuserpassword',
      age: 12,
    })

    const cookie = createUserResponse.get('Set-Cookie')

    await request(app.server).post('/meals').set('Cookie', cookie).send({
      id: crypto.randomUUID(),
      name: 'New meal plan',
      description: 'Its my new plan',
      mealInterval: 'Its my nee meal interval',
    })

    await request(app.server)
      .get('/meals/summary')
      .set('Cookie', cookie)
      .expect(200)
  })
})

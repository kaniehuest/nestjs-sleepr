describe('Reservations', () => {
    let jwt: string

    beforeAll(async () => {
        const user = {
            email: "e2eUser1@gmail.com",
            password: "str0ngPa$$word!"
        }

        await fetch("http://auth:3001/users", {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const response = await fetch('http://auth:3001/auth/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        jwt = await response.text()
    })

    test('Create and Get', async () => {
        const createdReservation = await createReservation()

        const responseGet = await fetch(
            `http://reservations:3000/reservations/${createdReservation._id}`,
            {
                headers: {
                    Authentication: jwt
                }
            }
        )
        const reservation = await responseGet.json()
        expect(createdReservation).toEqual(reservation)
    })

    const createReservation = async () => {
        const responseCreate = await fetch('http://reservations:3000/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authentication: jwt
            },
            body: JSON.stringify({
                "startDate": "02-01-2024",
                "endDate": "02-01-2024",
                "placeId": "123",
                "invoiceId": "123",
                "charge": {
                    "amount": 13,
                    "card": {
                        "cvc": "413",
                        "exp_month": 12,
                        "exp_year": 2027,
                        "number": "4242 4242 4242 4242"
                    }
                }
            })
        })
        expect(responseCreate.ok).toBeTruthy()
        return await responseCreate.json()
    }
})
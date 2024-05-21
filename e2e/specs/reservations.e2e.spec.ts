describe('Reservations', () => {
    beforeAll(async () => {
        const user = {
            email: "e2eUser1@gmail.com",
            password: "str0ngPa$$word!"
        }

        await fetch("http://auth:3001/user", {
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

        const jwt  = await response.text()
        console.log(jwt)
    })

    test('Create', () => {
        expect(true).toBeTruthy()
    })
})
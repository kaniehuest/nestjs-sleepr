describe('Reservations', () => {
    beforeAll(async () => {
        const user = {
            email: "holapistola19@gmail.com",
            password: "123$uppperPassword"
        }

        await fetch("http://auth:3000", {
            method: 'POST',
            body: JSON.stringify(user)
        })

    })

    test('Create', () => {

    })
})
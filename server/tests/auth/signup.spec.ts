import app from "@/app"
import Database from "@/config/dbConfig"
import request from "supertest"

describe("POST /api/auth/signup", () => {
    const testEmail = `testuser+${Date.now()}@example.com`

    it("should create a new user and return 201", async () => {
        const res = await request(app).post("/api/auth/signup").send({
            username: "testuser",
            email: testEmail, // use shared variable here
            password: "securePassword123",
        })

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty("model")
        expect(res.body.model).toHaveProperty("id")
        expect(res.body.model).toHaveProperty("email", testEmail)
    })

    it("should return 400 if validation fails", async () => {
        const res = await request(app).post("/api/auth/signup").send({
            username: "x",
            email: "not-an-email",
            password: "123",
        })

        expect(res.status).toBe(400)
        expect(res.body.errors).toBeDefined()
        expect(res.body.errors.length).toBeGreaterThan(0)
    })

    afterAll(async () => {
        const db = await Database.getInstance()
        await db.execute("DELETE FROM users WHERE email = ?", [testEmail])
    })
})

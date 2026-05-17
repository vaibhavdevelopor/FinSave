import { jest } from "@jest/globals";
import request from "supertest";
import { createApp } from "../app.js";

function createDoc(id, data) {
  return {
    id,
    data: () => data,
  };
}

function createFirestoreMock({ offers = [], topOffers = [] } = {}) {
  return {
    collection: jest.fn((name) => {
      if (name !== "offers") {
        throw new Error(`Unexpected collection: ${name}`);
      }

      return {
        where: jest.fn((field) => {
          if (field !== "isActive") {
            throw new Error(`Unexpected where field: ${field}`);
          }

          return {
            orderBy: jest.fn((orderField) => {
              if (orderField === "createdAt") {
                return {
                  get: jest.fn().mockResolvedValue({
                    docs: offers.map((offer) => createDoc(offer.id, offer)),
                  }),
                };
              }

              if (orderField === "cashbackValue") {
                return {
                  limit: jest.fn().mockReturnValue({
                    get: jest.fn().mockResolvedValue({
                      docs: topOffers.map((offer) => createDoc(offer.id, offer)),
                    }),
                  }),
                };
              }

              throw new Error(`Unexpected orderBy field: ${orderField}`);
            }),
          };
        }),
        add: jest.fn().mockResolvedValue({ id: "new-offer-id" }),
      };
    }),
  };
}

describe("createApp", () => {
  it("returns 200 from /health with firebase status", async () => {
    const app = createApp({
      getFirebaseStatus: () => ({
        firebaseReady: true,
        firebaseInitError: null,
      }),
    });

    const response = await request(app).get("/health").expect(200);

    expect(response.body).toEqual({
      ok: true,
      firebaseReady: true,
      firebaseInitError: null,
    });
  });

  it("returns offers from /offers", async () => {
    const db = createFirestoreMock({
      offers: [
        {
          id: "offer-1",
          platform: "Swiggy",
          title: "10% cashback",
          isActive: true,
        },
      ],
    });

    const app = createApp({
      getFirebaseStatus: () => ({
        firebaseReady: true,
        firebaseInitError: null,
      }),
      getFirestore: () => db,
    });

    const response = await request(app).get("/offers").expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.offers)).toBe(true);
    expect(response.body.offers[0]).toMatchObject({
      id: "offer-1",
      platform: "Swiggy",
      title: "10% cashback",
    });
  });

  it("returns top offers from /top-offers", async () => {
    const db = createFirestoreMock({
      topOffers: [
        {
          id: "offer-top",
          platform: "Amazon Pay",
          title: "15% cashback",
          cashbackValue: 15,
          isActive: true,
        },
      ],
    });

    const app = createApp({
      getFirebaseStatus: () => ({
        firebaseReady: true,
        firebaseInitError: null,
      }),
      getFirestore: () => db,
    });

    const response = await request(app).get("/top-offers").expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.offers[0]).toMatchObject({
      id: "offer-top",
      platform: "Amazon Pay",
      cashbackValue: 15,
    });
  });

  it("returns 503 when firebase is unavailable", async () => {
    const app = createApp({
      getFirebaseStatus: () => ({
        firebaseReady: false,
        firebaseInitError: "Firebase unavailable",
      }),
    });

    const response = await request(app).get("/offers").expect(503);

    expect(response.body).toEqual({
      success: false,
      error: "Firebase unavailable",
    });
  });
});

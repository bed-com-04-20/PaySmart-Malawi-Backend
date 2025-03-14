import { Controller, Post, Get, Param, Body } from "@nestjs/common";
import { HousePaymentsService } from "./house-payments.service";


@Controller("payments")
export class HousePaymentsController {
    constructor(private readonly housePaymentService: HousePaymentsService) {}

    @Post("record/:houseId")
    async recordPayment(
        @Param("houseId") houseId: number,
        @Body("amountPaid") amountPaid: number,
        
    ) {
        return this.housePaymentService.recordPayment(houseId, amountPaid);
    }

    @Get("history/:houseId")
    async getPaymentHistory(@Param("houseId") houseId: number) {
        return this.housePaymentService.getPaymentHistory(houseId);
    }

    @Get("balance/:houseId")
    async getRemainingBalance(@Param("houseId") houseId: number) {
        return this.housePaymentService.getRemainingBalance(houseId);
    }

    @Get("house/:deltaNumber")
    async getHouseByDelta(@Param("deltaNumber") deltaNumber: number) {
        return this.housePaymentService.getHouseByDelta(deltaNumber);
    }
}

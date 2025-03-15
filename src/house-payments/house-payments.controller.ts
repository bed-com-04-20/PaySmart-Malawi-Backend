import { Controller, Post, Get, Param, Body, BadRequestException } from "@nestjs/common";
import { HousePaymentsService } from "./house-payments.service";

@Controller("payments")
export class HousePaymentsController {
    constructor(private readonly housePaymentService: HousePaymentsService) {}

    @Post("record/:houseId")
    async recordPayment(
        @Param("houseId") houseId: number,
        @Body("amountPaid") amountPaid: number,
    ) {
        if (amountPaid <= 0) {
            throw new BadRequestException("Amount paid must be greater than 0.");
        }
        return this.housePaymentService.recordPayment(houseId, amountPaid);
    }

    @Get("history/:houseId")
    async getPaymentHistory(@Param("houseId") houseId: number) {
        try {
            return await this.housePaymentService.getPaymentHistory(houseId);
        } catch (error) {
            throw new BadRequestException("Error fetching payment history.");
        }
    }

    @Get("balance/:houseId")
    async getRemainingBalance(@Param("houseId") houseId: number) {
        try {
            return await this.housePaymentService.getRemainingBalance(houseId);
        } catch (error) {
            throw new BadRequestException("Error fetching remaining balance.");
        }
    }

    @Get("house/:deltaNumber")
    async getHouseByDelta(@Param("deltaNumber") deltaNumber: number) {
        try {
            const house = await this.housePaymentService.getHouseByDelta(deltaNumber);
            return {
                status: 'success',
                house
            };
        } catch (error) {
            throw new BadRequestException(error.message || "Error fetching house details.");
        }
    }
    
}

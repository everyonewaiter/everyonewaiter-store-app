package expo.modules.kscat

data class Tax(
    val amount: Long,
    val service: Long,
    val vat: Long,
    val supply: Long
) {
    companion object {
        fun calculateTax(amount: Long, vatRate: Double, serviceRate: Double): Tax {
            val service = calculateService(amount, serviceRate)
            val vat = calculateVat(amount, service, vatRate)
            val supply = amount - service - vat
            return Tax(amount, service, vat, supply)
        }

        private fun calculateService(amount: Long, serviceRate: Double): Long {
            var result: Long = 0
            if (serviceRate > 0) {
                val p: Double = 1 + (serviceRate / 100.0)
                val r: Double = (amount / p)
                result = amount - Math.round(r)
            }
            return result
        }

        private fun calculateVat(amount: Long, service: Long, vatRate: Double): Long {
            var result: Long = 0
            if (vatRate > 0) {
                val p: Double = 1 + (vatRate / 100.0)
                val r: Double = ((amount - service) / p)
                result = (amount - service) - Math.round(r)
            }
            return result
        }
    }
}

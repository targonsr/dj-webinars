package vehicles

import (
	"fmt"
	"strings"

	"github.com/brianvoe/gofakeit/v6"
)

// GenerateVehicles returns the list of mock vehicles.
func GenerateVehicles(count int) []Vehicle {
	var vehicles []Vehicle
	for i := 1; i <= count; i++ {
		car := gofakeit.Car()
		vehicles = append(vehicles, Vehicle{
			ID:    i,
			Make:  car.Brand,
			Model: car.Model,
		})
	}
	return vehicles
}

// GenerateInsertStatements generates a single INSERT statement for a slice of vehicles.
func GenerateInsertStatements(vehicles []Vehicle) string {
	if len(vehicles) == 0 {
		return ""
	}

	var sb strings.Builder
	sb.WriteString("INSERT INTO vehicles (id, make, model) VALUES\n")

	for i, v := range vehicles {
		sb.WriteString(fmt.Sprintf("    (%d, '%s', '%s')", v.ID, v.Make, v.Model))
		if i < len(vehicles)-1 {
			sb.WriteString(",\n")
		} else {
			sb.WriteString(";\n")
		}
	}

	return sb.String()
}

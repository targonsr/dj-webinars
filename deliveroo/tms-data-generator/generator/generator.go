package generator

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"tms-data-generator/generator/config"
	"tms-data-generator/generator/drivers"
	"tms-data-generator/generator/vehicles"
)

func generateTimestampComment() string {
	// Go's reference time for formatting is "Mon Jan 2 15:04:05 MST 2006"
	return fmt.Sprintf("-- Generated on: %s\n", time.Now().Format("2006-01-02 15:04:05"))
}

// Generate generates the SQL file.
// It takes an output file path and generates SQL for the predefined data.
// It returns an error if writing the file fails.
func Generate(outputFile string) error {
	outputDir := filepath.Dir(outputFile)
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		return fmt.Errorf("error creating output directory '%s': %w", outputDir, err)
	}

	schema, err := os.ReadFile("schema/create-tms-schema.sql")
	if err != nil {
		return fmt.Errorf("error reading schema file: %w", err)
	}

	var sb strings.Builder

	sb.WriteString(generateTimestampComment())
	sb.WriteString(banner)
	sb.Write(schema)
	sb.WriteString("\n")
	sb.WriteString(vehicles.GenerateInsertStatements(vehicles.GenerateVehicles(config.VEHICLES)))
	sb.WriteString(drivers.GenerateInsertStatements(drivers.GenerateDrivers(config.DRIVERS)))

	err = os.WriteFile(outputFile, []byte(sb.String()), 0644)
	if err != nil {
		return fmt.Errorf("error writing file to '%s': %w", outputFile, err)
	}
	fmt.Println("SQL file generated:", outputFile)
	return nil
}

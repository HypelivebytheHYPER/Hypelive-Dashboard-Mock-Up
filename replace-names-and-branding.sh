#!/bin/bash

# Thai Name Replacements (Common English names to Thai names)
# Female names
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Sarah Brown"/"Siriporn Srisawat"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Sarah J\."/"Siriporn S."/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Mary Stivens"/"Sumalee Wongsuk"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Emily Davis"/"Apinya Thanaporn"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Emily Martinez"/"Apinya Maneerat"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Emily Carter"/"Apinya Sanitwong"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Emma Johnson"/"Pranee Chaimongkol"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Alice Johnson"/"Busaba Rojchanawong"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Jennifer"/"Nattaya"/g' {} +

# Male names
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"John Doe"/"Somchai Suwanprasert"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Wilson"/"Nattapong Charoensuk"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Martinez"/"Nattapong Theerawat"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Martin"/"Nattapong Pongpanich"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Thomas"/"Nattapong Wattana"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Clear"/"Nattapong Samart"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"James Robinson"/"Nattapong Rattanakul"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Michael Wilson"/"Kittipong Sukhum"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Michael B\."/"Kittipong B."/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"David Lee"/"Wichai Lertsak"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"David L\."/"Wichai L."/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Liam Johnson"/"Chaiyaporn Saengtong"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Liam Walker"/"Chaiyaporn Wongwan"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Bob Johnson"/"Suchart Punyakul"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Daniel Johnson"/"Anupong Chanthong"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Noah Johnson"/"Thaksin Boonyarit"/g' {} +
find app -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's/"Robert"/"Somsak"/g' {} +

# Shadcn URL replacements to Hypelive branding
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i '' 's|https://shadcn\.com|https://hypelive.app|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i '' 's|http://twitter\.com/shadcn|https://twitter.com/hypelive|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i '' 's|https://shadcnuikit\.com|https://hypelive.studio|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i '' 's|https://free\.shadcnuikit\.com|https://dashboard.hypelive.studio|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" -o -name "*.md" \) -exec sed -i '' 's|shadcnuikit\.com|hypelive.studio|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's|placeholder="shadcn"|placeholder="hypelive"|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's|alt="shadcn ui kit"|alt="Hypelive Dashboard"|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.json" \) -exec sed -i '' 's|alt="@shadcn"|alt="@hypelive"|g' {} +

# Update description text
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|Built with shadcn/ui|Built with Hypelive|g' {} +
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|built with shadcn/ui|built with Hypelive|g' {} +

# Update title suffix
find . -type f \( -name "*.tsx" -o -name "*.ts" \) -exec sed -i '' 's|Shadcn UI Kit|Hypelive Dashboard|g' {} +

echo "✅ All names and branding updated successfully!"

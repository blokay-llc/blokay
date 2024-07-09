git remote add origin https://github.com/blokay-llc/blokay.git;
git fetch origin main
git reset --hard FETCH_HEAD
git clean -df;

rm -rf node_modules;
pnpm install;
pnpm i @blokay/react@latest --save;
pnpm run build;
pm2 restart blokay;
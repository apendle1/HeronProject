run:
	npm run dev --prefix ./server & \
	npm run dev --prefix ./rclient/herongame & \
	npm run dev --prefix ./rclient/herongame & \
	open http://localhost:5173/
	open http://localhost:5174/
	wait
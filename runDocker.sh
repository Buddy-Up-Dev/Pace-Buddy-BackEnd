
if [ "$DEPLOYMENT_GROUP_NAME" == "dev" ]
then
  # Remove any anonymous volumes attached to containers
  docker-compose -f /deploy/docker-compose.yml rm -v
  # build images and run containers
  docker-compose -f /deploy/docker-compose.yml up --detach --renew-anon-volumes
fi
# install minifabric
curl -o minifab -sL https://tinyurl.com/yxa2q6yr 
chmod +x minifab
sudo mv minifab /usr/local/bin

# clone the code
git clone https://github.com/ct-blockchain/minifabric

# build the new image locally
docker build -t hyperledgerlabs/minifab:latest .

# 1 site per directory or VM

##
# site A
##

minifab up -o orgA.com -e 7050  -n samplecc -p ''

##
# site B
##
minifab netup -o orgB.com -e 7060

cp vars/JoinRequest_orgB-com.json ../site_A/vars/NewOrgJoinRequest.json

##
# site A
##
# 
minifab channelquery,configmerge,channelsign,channelupdate

cp vars/profiles/endpoints.yaml ../site_B/vars/


##
# site B
##
minifab nodeimport,join -c mychannel

###
#### add site C
####

##
# site C
##
minifab netup -o orgC.com -e 7070

cp vars/JoinRequest_orgC-com.json ../site_A/vars/NewOrgJoinRequest.json


##
# site A
##
# 
minifab channelquery,configmerge,channelsign

sudo cp vars/mychannel_update_envelope.pb ../site_B/vars/


##
# site B
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_A/vars/


##
# site A
##
# 
minifab channelupdate

cp vars/profiles/endpoints.yaml ../site_C/vars/


##
# site C
##
minifab nodeimport,join -c mychannel



###
#### add site D
####

##
# site D
##
minifab netup -o orgD.com -e 7080

cp vars/JoinRequest_orgD-com.json ../site_A/vars/NewOrgJoinRequest.json


##
# site A
##
# 
minifab channelquery,configmerge,channelsign

sudo cp vars/mychannel_update_envelope.pb ../site_B/vars/


##
# site B
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_C/vars/

##
# site C
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_A/vars/


##
# site A
##
# 
minifab channelupdate

cp vars/profiles/endpoints.yaml ../site_D/vars/


##
# site D
##
minifab nodeimport,join -c mychannel



###
#### add site E
####

##
# site E
##
minifab netup -o orgE.com -e 7090

cp vars/JoinRequest_orgE-com.json ../site_A/vars/NewOrgJoinRequest.json


##
# site A
##
# 
minifab channelquery,configmerge,channelsign

sudo cp vars/mychannel_update_envelope.pb ../site_B/vars/


##
# site B
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_C/vars/

##
# site C
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_D/vars/

##
# site D
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_A/vars/



##
# site A
##
# 
minifab channelupdate

cp vars/profiles/endpoints.yaml ../site_E/vars/


##
# site E
##
minifab nodeimport,join -c mychannel


###
#### add site F
####

##
# site F
##
minifab netup -o orgF.com -e 8010

cp vars/JoinRequest_orgF-com.json ../site_A/vars/NewOrgJoinRequest.json


##
# site A
##
# 
minifab channelquery,configmerge,channelsign

sudo cp vars/mychannel_update_envelope.pb ../site_B/vars/


##
# site B
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_C/vars/

##
# site C
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_D/vars/

##
# site D
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_E/vars/

##
# site E
##
minifab channelsignenvelope

sudo cp vars/mychannel_update_envelope.pb ../site_A/vars/


##
# site A
##
# 
minifab channelupdate

cp vars/profiles/endpoints.yaml ../site_F/vars/


##
# site F
##
minifab nodeimport,join -c mychannel





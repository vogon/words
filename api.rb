require 'sinatra'
require 'slim'

class WordsAPI < Sinatra::Base
	get '/choosewords' do
		'["foo", "bar", "baz"]'
	end

	post '/submit' do
		print request.body.read

		200
	end

	get '/game' do

	end

	get '/' do
		slim :words
	end
end
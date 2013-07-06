require 'sinatra'
require 'slim'

class WordsAPI < Sinatra::Base
	get '/api/choosewords' do
		'["foo", "bar", "baz"]'
	end

	post '/api/submit' do
		print request.body.read

		200
	end

	get '/api/poem' do

	end

	get '/' do
		slim :words
	end
end
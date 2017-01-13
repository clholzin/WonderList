'use strict';

module.exports = function(grunt) {
	var LIVERELOAD_PORT = 35729;
	var ui5Config = {
		app: 'webapp',
		dist: 'dist'
	};
	var lrSnippet = require('grunt-contrib-watch/tasks/lib/livereload').livereloadSnippet;
	var mountFolder = function (connect, dir) {
		return connect.static(require('path').resolve(dir));
	};
	var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

	grunt.initConfig({

		dir: {
			webapp: 'webapp',
			dist: 'dist',
			bower_components: 'bower_components'
		},
		watch: {
			options: {
				atBegin: true,
				spawn: false
			},
			all: {
				files: '<%= dir.webapp %>/**/*'
				//tasks: ['newer:copy:all','newer:babel:all']
			},
			livereload: {
				//options: {
				//	livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
				//},
				//tasks: ['serve'],
				files: [
					'<%= dir.webapp %>/**/*.js',
					'<%= dir.webapp %>/css/*.css'
				],
				extDot: 'last'
			},
			transpile: {
				files: ['<%= dir.webapp %>/**/*.js'],
				tasks: ['babel:dist']
			},
		},
		connect: {
			options: {
				port: 9003,
				hostname: '*'
			},
			livereload:true,
			//	{
			//	options: {
			//		middleware: function (connect) {
			//			return [
			//				proxySnippet,
			//				lrSnippet,
			//				mountFolder(connect, ui5Config.app)
			//			];
			//		}
			//	}
			//},
			src: {},
			dist: {}
		},
		openui5_connect: {
			options: {
				resources: [
					'<%= dir.bower_components %>/openui5-sap.ui.core/resources',
					'<%= dir.bower_components %>/openui5-sap.m/resources',
					'<%= dir.bower_components %>/openui5-themelib_sap_bluecrystal/resources'
				]
			},
			src: {
				options: {
					appresources: '<%= dir.webapp %>'
				}
			},
			dist: {
				options: {
					appresources: '<%= dir.dist %>'
				}
			}
		},
		openui5_preload: {
			component: {
				options: {
					resources: {
						cwd: '<%= dir.dist %>',
						prefix: 'todo'
					},
					dest: '<%= dir.dist %>'
				},
				components: true
			}
		},
		clean: {
			dist: '<%= dir.dist %>/'
		},
		copy: {
			dist: {
				files: [ {
					expand: true,
					cwd: '<%= dir.webapp %>',
					src: [
						'**',
						'!**/*.js',
						'!test/**'
					],
					dest: '<%= dir.dist %>'
				} ]
			}
		},
		eslint: {
			webapp: ['<%= dir.webapp %>']
		},
		babel: {
			options: {
				sourceMap: true
				//presets: ['babel-preset-es2015']
			},
			dist: {
				files: [ {
					expand: true,
					cwd: '<%= dir.webapp %>',
					src: [
						//'**/*.*.js',
						'**/*.js'//,'!test/**'
					],
					dest: '<%= dir.dist %>',
					extDot: 'last',
					ext:'.js'
				}]
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-openui5');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-newer');

	// Server task
	grunt.registerTask('serve', function(target) {
		grunt.task.run([
			'openui5_connect:' + (target || 'src'),//:keepalive:watch
			'watch'
		]);
	});
	// Linting task
	grunt.registerTask('lint', ['eslint']);

	// Build task
	grunt.registerTask('build', ['clean','copy:dist','babel:dist','openui5_preload']);//

	// Default task
	grunt.registerTask('default', [
		'lint',
		'build',
		'serve:dist'
	]);
};
